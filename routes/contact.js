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
			let to_email = mailer.config.contact_messages_to;
			let subject = req.body.subject;
			let mailOptions = {
				from: mailer.config.defaultFromAddress,
				to: to_email,
				subject: 'Contact message: '+ subject,
				replyTo: req.body.email,
				template: 'contact',
				context: {
					siteUrl: mailer.siteUrl,
					subject: subject,
					message: req.body.message
				}
			};

			mailer.transporter.sendMail(mailOptions, (error, info) => {
				if(error) {
					console.log( error );
					res.json({ 'err': 'mail error.' });
				}else {
					console.log( 'Message sent: ' + info.response );
					res.json({ status: 1 });
				}
			});
		}else{
			res.json({ 'err': 'captcha error.' });
		}
	});
});

module.exports = router;
