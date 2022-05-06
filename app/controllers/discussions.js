const DiscussionModel = require('../models/discussions.js');

module.exports = class Discussion {
    constructor(app, connect) {
        this.app = app;
        this.DiscussionModel = connect.model('Discussion', DiscussionModel);
        this.run();
    }

    run() {
        this.app.post('/discussion/', async (req, res)=> {
            const { user_group, user_events} = req.body;
            if (!user_events && !user_group) {
              //console.log(organizer);
                return res.status(422).json({ error: "Please fill your details" });
            }
            try{

              const DiscussionModel = new this.DiscussionModel(req.body);

              DiscussionModel.save().then(async (rel) => {
                  if (user_group) {
                    const rel = await this.DiscussionModel.findByIdAndUpdate(
                      req.params.id,
                      { $push: { user_group: rel._id } },
                      { new: true, useFindAndModify: false }
                    );
                  } else if (user_events) {
                    const rel = await this.DiscussionModel.findByIdAndUpdate(
                      req.params.id,
                      { $push: { user_events: rel._id } },
                      { new: true, useFindAndModify: false }
                    );
                  }
                  res.status(200).json(rel || {});
              }).catch((err)=>{
                  console.log(err);
                  res.status(200).json({});
              });
          } catch(err) {
              console.error(`[ERROR] post:Discussion -> ${err}`);
          
              res.status(400).json({
                  code: 400,
                  message: 'Bad Request'
              });
          }
        });

        this.app.get("/discussion", async (req, res, next) => {
            
            //console.log("test");

            try {
              const users = await this.DiscussionModel.find();
              res.send(users);
            } catch (error) {
              res.status(500).send(error);
              next();
            }
          });
        
        this.app.patch("/discussion/:id", async (req, res) => {
            try {
              await this.DiscussionModel.findByIdAndUpdate(req.params.id, req.body);
              console.log(req.params.id);
              console.log(req.body);
              await this.DiscussionModel.save();
              res.send(user);
            } catch (user) {
              res.status(500).send(user);
            }
          });

        this.app.delete("/discussion/:id", async (req, res) => {
            try {
              const user = await this.DiscussionModel.findByIdAndDelete(req.params.id);
          
              if (!user) res.status(404).send("No item found");
              res.status(200).send();
            } catch (error) {
              res.status(500).send(error);
            }
          });

        this.app.patch("/discussion/:id/message", async (req, res) => {
          try {
            const { message_user } = req.body;
            await this.DiscussionModel.findByIdAndUpdate(
              req.params.id,
              { $push: { message: message_user } },
              { new: true, useFindAndModify: false }
            );
            console.log(req.params.id);
            console.log(req.body);
            await this.DiscussionModel.save();
            res.send(user);
          } catch (user) {
            res.status(500).send(user);
          }
        });
    }
}