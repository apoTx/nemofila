let express = require('express');
let router = express.Router();

// Models
let Ads = require('../../models/ads');
let Users = require('../../models/users');

let requireLogin = require('./inc/requireLogin.js');

// Mail transporter
let mailer = require('../../helper/mailer');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/ads/ads', { title: 'Ads' });
});

router.get('/edit/:id', requireLogin, (req, res) => {
	Ads.findById( req.params.id ,(err,result) => {
		let statusText;
		if (result.status === 0)
			statusText = 'Waiting';
		else if (result.status === 1)
			statusText = 'Approved';
		else if (result.status === 2)
			statusText = 'Rejected';
		else if (result.status === 3)
			statusText = 'Time Ending';
		else if (result.status === 4)
			statusText = 'Unpublished';
		else
			statusText = 'Another';

		res.render('manage/ads/ad_edit', {
			title: result.title,
			data: result,
			statusText: statusText
		});
	});
});

router.post('/publishAd', requireLogin, (req, res) => {
	let data = req.body;
	let publishStatus = parseInt(req.body.publishStatus);

	let updateDate = {
		status: publishStatus
	};

	if (publishStatus === 1){
		Object.assign(updateDate, { listingDate: new Date() });
	}

	Ads.findByIdAndUpdate(data.id, updateDate, (err,result) => {
		if (!err){
			res.json({ status: 1 });

			Users.findById(result.ownerId, (err,response) => {
				// send email
				let to_email = response.email;
				let subject = publishStatus === 1 ? 'Your ad has been published' : 'Your ad has been rejected';
				let mailOptions = {
					from: mailer.config.defaultFromAddress,
					to: to_email,
					subject: subject,
					template: 'ad-approve',
					context: {
						siteUrl: mailer.siteUrl,
						adTitle: result.title,
						slug: result.slug,
						id: result._id,
						subject: subject,
						reason: data.reason ? data.reason : ''
					}
				};

				mailer.transporter.sendMail(mailOptions, (error, info) => {
					if(error)
						console.log(error);
					else
						console.log('Message sent: ' + info.response);
				});
			});
		}
	});
});

router.post('/unpublish', requireLogin, (req, res, next) => {
	let id = req.body.id;

	Ads.findByIdAndUpdate(id, { status: 4 }, (err) => {
		if (!err)
			res.json({ status: 1 });
	});
});

router.get('/getAllAds', requireLogin, (req, res, next) => {
	Ads.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'ownerId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },
		{ $sort : { _id : -1 } },
		{
			'$project': {
				'_id': 1,
				'title': 1,
				'status': 1,
				'slug': 1,
				'createdAt': 1,
				'user.name': 1,
				'user.surname': 1,
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);

		res.json(result);
	});
});

module.exports = router;
