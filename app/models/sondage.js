const mongoose = require('mongoose');

const SondageSchema = new mongoose.Schema({
  user_events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'events'
  }],
  questions: [{question: String, answers: [String]}],
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


module.exports = SondageSchema