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
	description: {
		type: String,
	},
	photos: [],
	photoShowcaseIndex: {
		type: Number,
	},
	power: {
		powerStatus: Boolean,
		powerNumber: Number
	},
	uuid: {
		type: String
	},
	place: {},
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
	updateAt: { // for sorting. not edit date.
		type: Date,
		default: Date.now
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
	},
	phone: {
		type: String,
	},
	mobile_phone: {
		type: String,
	},
	address:String,
	website: String,
	pageView: {
		type: Number,
		default: 0
	},
	rates: [
		{
			userId: ObjectId,
			score: Number
		},
	],
	workTimes: {
		monday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		},
		tuesday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		},
		wednesday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		},
		thursday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		},
		friday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		},
		saturday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		},
		sunday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: Boolean,
			openTime: String,
			closeTime: String
		}
	}
});

module.exports = mongoose.model('ads', adSchema);
