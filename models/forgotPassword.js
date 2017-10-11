let mongoose = require('mongoose');
let Schema	 = mongoose.Schema;

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
	status: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose.model('forgotpasswords', forgotPasswordSchema);
