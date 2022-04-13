const EventsModel = require('../models/events.js');

module.exports = class Events {
    constructor(app, connect) {
        this.app = app;
        this.EventsModel = connect.model('Events', EventsModel);
        this.run();
    }

    run() {
        this.app.post('/events/', async (req, res)=> {
            const { name, description, dateDebut , organizer, members} = req.body;
            if (!name || !description || !dateDebut || !organizer) {
                return res.status(422).json({ error: "Please fill your details" });
            }
            try{

                const EventsModel = new this.EventsModel(req.body);

                EventsModel.save().then(async (user) => {
                    if (members) {
                      const user = await this.EventsModel.findByIdAndUpdate(
                        req.params.id,
                        { $push: { members: user._id } },
                        { new: true, useFindAndModify: false }
                      );
                    } if (organizer) {
                      const user = await this.EventsModel.findByIdAndUpdate(
                        req.params.id,
                        { $push: { organizer: user._id } },
                        { new: true, useFindAndModify: false }
                      );
                    }
                    res.status(200).json(user || {});
                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({});
                });
            } catch(err) {
                console.error(`[ERROR] post:events -> ${err}`);
            
                res.status(400).json({
                    code: 400,
                    message: 'Bad Request'
                });
            }
        });

        this.app.get("/events", async (req, res, next) => {
            
            console.log("test");

            try {
              const users = await this.EventsModel.find();
              res.send(users);
            } catch (error) {
              res.status(500).send(error);
              next();
            }
          });
        
        this.app.patch("/events/:id", async (req, res) => {
            try {
              await this.EventsModel.findByIdAndUpdate(req.params.id, req.body);
              console.log(req.params.id);
              console.log(req.body);
              await this.EventsModel.save();
              res.send(user);
            } catch (user) {
              res.status(500).send(user);
            }
          });

        this.app.delete("/events/:id", async (req, res) => {
            try {
              const user = await this.EventsModel.findByIdAndDelete(req.params.id);
          
              if (!user) res.status(404).send("No item found");
              res.status(200).send();
            } catch (error) {
              res.status(500).send(error);
            }
          });
    }
}