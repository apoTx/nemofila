let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let messageSchema = new Schema({
	conversationId: Schema.Types.ObjectId,
	fromUserId: Schema.Types.ObjectId,
	message: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('messages', messageSchema);
