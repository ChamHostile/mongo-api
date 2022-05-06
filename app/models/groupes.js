const mongoose = require('mongoose');


const GroupSchema = new mongoose.Schema({
  name: {type : String},
  description: {type: String},
  groupType: {
    type: String,
    enum: ['public', 'privé', 'secret'],
    default: 'public'
  },
  icon: {type: String},
  cover_picture: {type: String},
  create_event: {type: Boolean},
  publication: {type: Boolean}
},{
  collection: 'groups',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})


module.exports = GroupSchema