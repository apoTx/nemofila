let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let subscribeSchema = new Schema({
	email: {
		unique: true,
		type: String
	},
});

module.exports = mongoose.model('subscribes', subscribeSchema);
