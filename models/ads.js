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
	description2: {
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
	zipCode: {
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
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		},
		tuesday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		},
		wednesday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		},
		thursday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		},
		friday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		},
		saturday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		},
		sunday: {
			open: {
				type: Boolean,
				default: false
			},
			hour24: {
				type: Boolean,
				default: false
			},
			openTime: {
				type: String,
				//default: '07:00'
			},
			closeTime: {
				type: String,
				//default: '23:00'
			}
		}
	},
	adminAd: {
		type: Boolean,
	},
	toEmailAddress: {
		type: String,
	}
});

module.exports = mongoose.model('ads', adSchema);
