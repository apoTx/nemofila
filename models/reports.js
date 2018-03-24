const mongoose = require('mongoose');
const Schema	 = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reportSchema = new Schema({
	adId: ObjectId,
	message: {
		type: String,
		maxlength: 600
	},
	userId: ObjectId,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('reports', reportSchema);
