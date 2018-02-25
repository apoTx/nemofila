let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let favouritesSchema = new Schema({
	userId: Schema.Types.ObjectId,
	adId: Schema.Types.ObjectId, // adId or eventId
	type: Number
});

module.exports = mongoose.model('favourites', favouritesSchema);
