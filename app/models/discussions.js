const mongoose = require('mongoose');


const DiscussionSchema = new mongoose.Schema({
  user_group: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'groups'
  }],
  user_events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'events'
  }],
  photos: [{type: String}],
},{
  collection: 'discussions',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})


module.exports = DiscussionSchema