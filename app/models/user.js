const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  firstname: {type: String},
  lastname: {type: String},
  age: {type: Number},
  city: {type: String},
  email: {
    type: String,
    match: [
      new RegExp('^(.+)@(.+)$', 'i'),
    ], 
    validate: {
      validator: async function(email) {
        const user = await this.constructor.findOne({ email });
        if(user) {
          if(this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: props => 'The specified email address is already in use.'
    },
    required: [true, 'User email required']
    }
}, {
  collection: 'users',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})


module.exports = Schema