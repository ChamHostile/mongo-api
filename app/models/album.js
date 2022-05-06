const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  user_events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'events'
  }],
  photos: [{type: String}],
},{
  collection: 'album',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})


module.exports = AlbumSchema