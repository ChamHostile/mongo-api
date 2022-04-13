// Dependencies
const express = require('express');
const mongoose = require('mongoose');

// Dependencies middleware express
const bodyparser = require('body-parser');

// Core
const config = require('./config.js');
const routes = require('./controllers/routes.js');

module.exports = class Server {
  constructor() {
    this.app = express();
    this.config = config[process.argv[2]] || config.development;
  }

  dbConnect(){
    const host = this.config.mongodb.host;
    const connect = mongoose.createConnection(host);

    connect.on('error', (err) => {
        setTimeout(() => {
            console.log(`[ERROR] users api dbConnect()-> ${err}`);
            this.connect = this.dbConnect(host);
        },5000);
    });

    connect.on('disconnected', (err) => {
        setTimeout(() => {
            console.log(`[DISCONNECTED] users api dbConnect()-> mongodb disconnected`);
            this.connect = this.dbConnect(host);
        },5000);
    });

    process.on('SIGINT', () => {
      connect.close(() => {
        console.log('[API END PROCESS] users api dbConnect() -> close mongodb connection')
        process.exit(0)
      })
    } )   

    return connect;
  }
  
  /**
   * Middleware
   */
  middleware() {
    this.app.use(bodyparser.urlencoded({extended : true}));
    this.app.use(bodyparser.json());
  }
  
/**
 * Routes
 */
  routes() {
    new routes.Users(this.app, this.connect);
    this.app.use((req,res) => {
      res.status(404).json({
        code: 404,
        message: 'Not found'
      });
    });
  }
  /**
   * Run
   */
  run() {
    try{
        this.connect = this.dbConnect();
        this.middleware();
        this.routes();
        this.app.listen(this.config.express.port); // Permet de lancer l'api express
    } catch(err){
        console.error(`[ERROR Server] -> ${err}`);
    }
  }
}