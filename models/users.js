const mongoose = require('mongoose');
const Schema	 = mongoose.Schema;

const userSchema = new Schema({
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
	},
	verify: {
		type: Boolean,
		default:0
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	social: {
		id: String,
		link: String,
		provider: String,
		screen_name: String
	},
	profilePictureType: String, // social or custom
	profilePictureUrl: String
});

userSchema.statics.findOrCreate = require('find-or-create');
module.exports = mongoose.model('users', userSchema);
