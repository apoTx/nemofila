let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let adSchema = new Schema({
	title: {
		type: String,
		// required: true
	},
	price: {
		type: Number,
		// required: true
	},
	description: {
		type: String
	},
	photos: [],
	uuid: {
		type: String
	},
	location:{
		countryId: String,
		cityId: String,
		districtId: String,
	},
	category: {
		categoryId: {
			type: String,
			// required: true
		},
		categoryChildId: {
			type: String,
			// required: true
		}
	},
	anotherContact: {
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
	}
});

module.exports = mongoose.model('ads', adSchema);
