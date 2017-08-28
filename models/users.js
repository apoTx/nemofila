let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  pw: {
    type: String,
  },
  auth: {
    default: 0
  },
  social         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String,
    username     : String,
    avatar       : String,
    tip 		 : String
  }
});

module.exports = mongoose.model('users', userSchema);