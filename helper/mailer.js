let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');

let transporter = nodemailer.createTransport({
	service: process.env.MAIL_SERVICE,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD
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
	siteUrl: process.env.SITE_URL
};
