let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let countrySchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	cities: [
		{
			name: String,
			districts: [
				{
					name: String
				}
			]
		}
	]
});

module.exports = mongoose.model('countries', countrySchema);
