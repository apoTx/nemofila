let nodemailer = require('nodemailer');
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

let transporter = nodemailer.createTransport({
	service: config.mail.service,
	auth: {
		user: config.mail.user,
		pass: config.mail.pass
	}
});

module.exports = transporter;
