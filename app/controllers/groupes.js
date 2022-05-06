const GroupsModel = require('../models/groupes.js');

module.exports = class Groups {
    constructor(app, connect) {
        this.app = app;
        this.GroupsModel = connect.model('Groups', GroupsModel);
        this.run();
    }

    run() {
        this.app.post('/groups/', async (req, res)=> {
            const { name, description , publication} = req.body;
            if (!name || !description || !publication) {
              //console.log(organizer);
                return res.status(422).json({ error: "Please fill your details" });
            }
            try{

                const GroupsModel = new this.GroupsModel(req.body);

                GroupsModel.save().then(async (user) => {
                    res.status(200).json(user || {});
                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({});
                });
            } catch(err) {
                console.error(`[ERROR] post:Groups -> ${err}`);
            
                res.status(400).json({
                    code: 400,
                    message: 'Bad Request'
                });
            }
        });

        this.app.get("/groups", async (req, res, next) => {
            
            //console.log("test");

            try {
              const users = await this.GroupsModel.find();
              res.send(users);
            } catch (error) {
              res.status(500).send(error);
              next();
            }
          });
        
        this.app.patch("/groups/:id", async (req, res) => {
            try {
              await this.GroupsModel.findByIdAndUpdate(req.params.id, req.body);
              console.log(req.params.id);
              console.log(req.body);
              await this.GroupsModel.save();
              res.send(user);
            } catch (user) {
              res.status(500).send(user);
            }
          });

        this.app.delete("/groups/:id", async (req, res) => {
            try {
              const user = await this.GroupsModel.findByIdAndDelete(req.params.id);
          
              if (!user) res.status(404).send("No item found");
              res.status(200).send();
            } catch (error) {
              res.status(500).send(error);
            }
          });
    }
}