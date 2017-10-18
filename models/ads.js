let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;
let ObjectId = Schema.ObjectId;


let adSchema = new Schema({
	title: {
		type: String,
		// required: true
	},
	slug: {
		type: String
	},
	price: {
		type: Number,
		// required: true
	},
	description: {
		type: String,
	},
	photos: [],
	photoShowcaseIndex: {
		type: Number
	},
	uuid: {
		type: String
	},
	location:{
		countryId: ObjectId,
		cityId: ObjectId,
		districtId: ObjectId,
	},
	category: {
		categoryId: ObjectId ,
		categoryChildId: ObjectId ,
	},
	anotherContact: {
		checked: {
			type: Boolean
		},
		name: {
			type: String,
			// required: true
		},
		phone: {
			type: String,
			// required: true
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	listingDate: {
		type: Date,
	},
	ownerId: {
		type: ObjectId
	},
	status: {
		type: Number,
		default: 0,
	},
	statusText: {
		type: String,
		default: 'Waiting'
	}
});

module.exports = mongoose.model('ads', adSchema);
