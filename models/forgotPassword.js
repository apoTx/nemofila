let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;
let moment = require('moment');

let minutesFromNow = function(){
	return moment().add(10, 'm');
};

let forgotPasswordSchema = new Schema({
	userId: Schema.Types.ObjectId,
	uuid: {
		type: String,
		unique: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastValidityTime:{
		type: Date,
		default: minutesFromNow
	},
	status: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('forgotpasswords', forgotPasswordSchema);
