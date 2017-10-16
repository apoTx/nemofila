let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let userSchema = new Schema({
	username: {
		type: String,
	},
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: String
	},
	isAdmin: {
		type: Boolean,
		default: 0
	},
	verify: {
		type: Boolean,
		default:0
	},
	createdAt: {
		type: Date,
		default: Date.now
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
