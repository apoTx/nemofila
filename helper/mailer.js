let nodemailer = require('nodemailer');
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
let hbs = require('nodemailer-express-handlebars');

let transporter = nodemailer.createTransport({
	service: config.mail.service,
	auth: {
		user: config.mail.user,
		pass: config.mail.pass
	}
});

let options = {
	viewEngine: {
		extname: '.hbs',
		layoutsDir: 'views/mailer/',
		defaultLayout : 'layout',
		partialsDir : 'views/mailer/partials/'
	},
	viewPath: 'views/mailer/',
	extName: '.hbs'
};

transporter.use('compile', hbs(options));

module.exports = {
	transporter: transporter,
	config: config.mail,
	siteUrl: config.siteUrl
};
