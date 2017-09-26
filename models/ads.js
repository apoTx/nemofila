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
		type: String
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
		categoryId: {
			type: ObjectId,
			// required: true
		},
		categoryChildId: {
			type: ObjectId,
			// required: true
		}
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
		default: new Date()
	},
	ownerId: {
		type: ObjectId
	}
});

module.exports = mongoose.model('ads', adSchema);
