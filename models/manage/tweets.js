let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let tweetSchema = new Schema({
  user: {
    name: String,
    screen_name: String,
    avatar: String
  },
  text: String,
  twitterTwitID:{
    type: String,
    unique: true
  },
  media: [{
    media_url: String
  }]

});


module.exports = mongoose.model('tweets', tweetSchema);