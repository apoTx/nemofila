let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let countrySchema = new Schema({
	name: {
		type: String,
	},
	cities: [
		{
			name: String,
			district: [
				{
					name: String
				}
			]
		}
	]
});

module.exports = mongoose.model('countries', countrySchema);
