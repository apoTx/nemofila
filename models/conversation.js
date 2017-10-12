let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let conversationSchema = new Schema({
	adId: Schema.Types.ObjectId,
	participants: {
		fromUserId: Schema.Types.ObjectId,
		toUserId: Schema.Types.ObjectId,
	}
});

module.exports = mongoose.model('conversations', conversationSchema);
