let mongoose = require('mongoose');
let moment = require('moment');

let Schema	 = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let powerSchema = new Schema({
	adId: ObjectId,
	powerNumber:Number,
	price: Number,
	createdAt: {
		type: Date,
		default: Date.now
	},
	endingAt: {
		type: Date,
		default: moment().add(30, 'd')
	}
});

module.exports = mongoose.model('powers', powerSchema);
