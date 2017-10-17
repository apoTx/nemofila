let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let messageSchema = new Schema({
	conversationId: Schema.Types.ObjectId,
	fromUserId: Schema.Types.ObjectId,
	toUserId: Schema.Types.ObjectId,
	message: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	read: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('messages', messageSchema);
