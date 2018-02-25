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
	],
	type: {
		type: Boolean,
		default: 0, // 0 = normal category, 1 = event category
	}
});

module.exports = mongoose.model('categories', categorySchema);
