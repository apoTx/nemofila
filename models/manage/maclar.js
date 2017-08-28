let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let yayinSchema = new Schema({
  title: String,
  text: String,
  streams: [{
    type: String,
    url: String
  }]

});


module.exports = mongoose.model('yayin', yayinSchema);