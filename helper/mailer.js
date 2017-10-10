let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'mehmetseven0@gmail.com',
		pass: 'Fransua7171+0+'
	}
});

module.exports = transporter;
