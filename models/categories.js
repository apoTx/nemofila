let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

let categorySchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	subCategories: [
		{
			name: String,
		}
	]
});

module.exports = mongoose.model('categories', categorySchema);
