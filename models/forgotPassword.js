let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;
let moment = require('moment');

let forgotPasswordSchema = new Schema({
	userId: Schema.Types.ObjectId,
	uuid: {
		type: String,
		unique: true
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	lastValidityTime:{
		type: Date,
		default: moment(new Date()).add(10, 'm').toDate()
	},
	status: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('forgotpasswords', forgotPasswordSchema);
