let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let messageSchema = new Schema({
	conversationId: Schema.Types.ObjectId,
	userId: Schema.Types.ObjectId,
	message: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
});

module.exports = mongoose.model('messages', messageSchema);
