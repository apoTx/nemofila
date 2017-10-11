let express = require('express');
let bcrypt = require('bcryptjs');

let router = express.Router();

// Models
let User = require('../models/users');
let Ads = require('../models/ads');
let forgotPasswords = require('../models/forgotPassword');

// Mail transporter
let mailer = require('../helper/mailer');


/* GET home page. */
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
				'user.name': 1,
				'user.surname': 1,
				'user.email': 1,
			},
		},
	], (err, result)=> {
		if (err)
			return next( err );

		console.log(result);

		if (result.length < 1){
			res.status(404).render('error/404', { message: 'This Page Not Found' });
		}else{
			res.render('account/reset_password', { title:'Reset Password', data: result[0].user });
		}
	});

});

router.post( '/reset_password', ( req, res ) => {
	console.log(req.body);
});

module.exports = router;
