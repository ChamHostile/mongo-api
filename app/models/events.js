const mongoose = require('mongoose');


const EventSchema = new mongoose.Schema({
  name: {type : String},
  description: {type: String},
  date_start: {type: Date},
  date_end: {type: Date},
  place: { type: String },
  picture: {type: String},
  event_type: {type: Boolean},
  organizer: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
},{
  collection: 'events',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})


module.exports = EventSchema