let express = require('express');
let bcrypt = require('bcryptjs');
let router = express.Router();

// Models
let User = require('../models/users');
let forgotPasswords = require('../models/forgotPassword');

// Mail transporter
let mailer = require('../helper/mailer');

router.get( '/reset_password/:uuid', ( req, res, next ) => {
	let uuid = req.params.uuid;

	forgotPasswords.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },
		{
			'$match': {
				'uuid': uuid,
				'status': true,
				'lastValidityTime': {
					$gt: new Date()
				}
			}
		},
		{ $limit: 1 },
		{
			'$project': {
				'createdAt': 1,
				'lastValidityTime': 1,
				'user._id': 1,
				'user.name': 1,
				'user.surname': 1,
				'user.email': 1,
			},
		},
	], (err, result)=> {
		if (err)
			return next( err );

		if (result.length < 1)
			res.status(404).render('error/404', { message: 'This Page Not Found' });
		else
			res.render('account/reset_password', {
				title:'Reset Password',
				data: result[0].user,
				uuid: uuid
			});
	});
});

router.post( '/reset_password', ( req, res ) => {
	let password =  req.body.password.trim();
	let passwordConfirm = req.body.passwordConfirm.trim();
	let userId = req.body.userId;
	let resetPasswordUuid = req.body.resetPasswordUuid;

	if (password !== passwordConfirm){
		res.json({ error: 'Passwords do not match.' });
	}else{
		// Password hash
		const saltRounds = 10;
		bcrypt.hash(password, saltRounds).then((hash) => {
			User.findByIdAndUpdate( userId , {
				password: hash
			}, (err,user) => {
				if (err) {
					throw (err);
				}else {
					res.json( { status: 1 } );

					// send email
					let to_email = user.email;
					let mailOptions = {
						from: process.env.MAIL_DEFAULT_FROM_ADDRESS,
						to: to_email,
						subject: 'Your Easyad password has been changed',
						template: 'forgot-password-changed',
						context: {
							siteUrl: process.env.SITE_URL,
							email : to_email,
						}
					};

					mailer.transporter.sendMail(mailOptions, (error, info) => {
						if(error)
							console.log(error);
						else
							console.log('Message sent: ' + info.response);
					});
				}
			});
		});

		forgotPasswords.findOneAndUpdate({ uuid: resetPasswordUuid } , {
			status: false
		}, (err) => {
			if (err){
				console.log(err);
				throw (err);
			}
		});
	}
});

module.exports = router;
