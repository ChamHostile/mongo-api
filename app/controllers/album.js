const AlbumModel = require('../models/album.js');

module.exports = class Album {
    constructor(app, connect) {
        this.app = app;
        this.AlbumModel = connect.model('Album', AlbumModel);
        this.run();
    }

    run() {
        this.app.post('/album/', async (req, res)=> {
            const { user_events, photos } = req.body;
            if ( !user_events || !photos ) {
              //console.log(organizer);
                return res.status(422).json({ error: "Please fill your details" });
            } else if (user_events.length > 1){
              return res.status(422).json({ error: "No more than one event allowed" });
            }
            try{

                const AlbumModel = new this.AlbumModel(req.body);

                AlbumModel.save().then(async (user) => {
                    res.status(200).json(user || {});
                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({});
                });
            } catch(err) {
                console.error(`[ERROR] post:Album -> ${err}`);
            
                res.status(400).json({
                    code: 400,
                    message: 'Bad Request'
                });
            }
        });

        this.app.get("/album", async (req, res, next) => {
            
            //console.log("test");

            try {
              const users = await this.AlbumModel.find();
              res.send(users);
            } catch (error) {
              res.status(500).send(error);
              next();
            }
          });
        
        this.app.patch("/album/:id", async (req, res) => {
            try {
              await this.AlbumModel.findByIdAndUpdate(req.params.id, req.body);
              console.log(req.params.id);
              console.log(req.body);
              await this.AlbumModel.save();
              res.send(user);
            } catch (user) {
              res.status(500).send(user);
            }
          });

        this.app.delete("/album/:id", async (req, res) => {
            try {
              const user = await this.AlbumModel.findByIdAndDelete(req.params.id);
          
              if (!user) res.status(404).send("No item found");
              res.status(200).send();
            } catch (error) {
              res.status(500).send(error);
            }
          });
    }
}