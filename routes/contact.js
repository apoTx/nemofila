let express = require('express');
let router = express.Router();

// helpers
let mailer = require('../helper/mailer');
let verifyRecaptcha = require('../helper/recaptcha');

router.get( '/', ( req, res) => {
	res.render('contact', { title: res.__('contact_page_title') });
});

router.post( '/', ( req, res) => {
	verifyRecaptcha(req.body.recaptcha, (success) => {
		if (success) {
			let to_email = process.env.MAIL_CONTACT_MESSAGES_TO;
			let subject = req.body.subject;
			let mailOptions = {
				from: process.env.MAIL_DEFAULT_FROM_ADDRESS,
				to: to_email,
				subject: 'Contact message: '+ subject,
				replyTo: req.body.email,
				template: 'contact',
				context: {
					siteUrl: process.env.SITE_URL,
					subject: subject,
					message: req.body.message
				}
			};

			mailer.transporter.sendMail(mailOptions, (error, info) => {
				if(error) {
					console.log( error );
					res.json({ 'error': res.__('error_sending_mail') });
				}else {
					console.log( 'Message sent: ' + info.response );
					res.json({ status: 1 });
				}
			});
		}else{
			res.json({ 'error': res.__('captcha_error') });
		}
	});
});

module.exports = router;
