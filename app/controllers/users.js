const UserModel = require('../models/user.js');

module.exports = class Users {
    constructor(app, connect) {
        this.app = app;
        this.UserModel = connect.model('User', UserModel);
        this.run();
    }

    run() {
        this.app.post('/users/', (req, res)=> {
            const { firstname, lastname, email } = req.body;
            if (!firstname || !email || !lastname) {
                return res.status(422).json({ error: "Please fill your details" });
            }
            try{
                const userModel = new this.UserModel(req.body);

                userModel.save().then((user) => {
                    res.status(200).json(user || {});
                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({});
                });
            } catch(err) {
                console.error(`[ERROR] post:users -> ${err}`);
            
                res.status(400).json({
                    code: 400,
                    message: 'Bad Request'
                });
            }
        });

        this.app.get("/users", async (req, res, next) => {
            
            console.log("test");

            try {
              const users = await this.UserModel.find();
              res.send(users);
            } catch (error) {
              res.status(500).send(error);
              next();
            }
          });
        
        this.app.patch("/users/:id", async (req, res) => {
            try {
              await this.UserModel.findByIdAndUpdate(req.params.id, req.body);
              console.log(req.params.id);
              console.log(req.body);
              await this.UserModel.save();
              res.send(user);
            } catch (user) {
              res.status(500).send(user);
            }
          });

        this.app.delete("/users/:id", async (req, res) => {
            try {
              const user = await this.UserModel.findByIdAndDelete(req.params.id);
          
              if (!user) res.status(404).send("No item found");
              res.status(200).send();
            } catch (error) {
              res.status(500).send(error);
            }
          });
    }
}