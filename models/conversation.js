let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let conversationSchema = new Schema({
	adId: Schema.Types.ObjectId,
	participants: {
		user1Id: Schema.Types.ObjectId,
		user2Id: Schema.Types.ObjectId,
	}
});

module.exports = mongoose.model('conversations', conversationSchema);
