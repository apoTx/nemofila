let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let eventSchema = new Schema({
	title: {
		type: String,
		// required: true
	},
	categoryId: ObjectId,
	adId: {
		type: ObjectId
	},
	ownerId: {
		type: ObjectId
	},
	slug: {
		type: String
	},
	description: {
		type: String,
	},
	photos: [],
	photoShowcaseIndex: {
		type: Number,
	},
	category: {
		categoryId: ObjectId ,
		categoryChildId: ObjectId ,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	listingDaysAgo: {
		type: Number,
	},
	status: {
		type: Number,
		default: 0,
	},
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
	pageView: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('events', eventSchema);
