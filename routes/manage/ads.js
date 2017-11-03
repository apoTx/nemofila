let express = require('express');
let router = express.Router();

// Models
let Ads = require('../../models/ads');
let Users = require('../../models/users');

let requireLogin = require('./inc/requireLogin.js');

// Helper
let getAdStatusText = require('../../helper/getAdStatusText');

// Mail transporter
let mailer = require('../../helper/mailer');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/ads/ads', { title: 'Ads' });
});

router.get('/edit/:id', requireLogin, (req, res, next) => {
	Ads.findById( req.params.id ,(err,result) => {
		if (err)
			next();

		if (result)
			res.render('manage/ads/ad_edit', {
				title: result.title,
				data: result,
				statusText: getAdStatusText(result.status)
			});
		else
			next();
	});
});

router.post('/publishAd', requireLogin, (req, res) => {
	let data = req.body;
	let publishStatus = parseInt(req.body.publishStatus);

	let updateDate = {
		status: publishStatus,
		statusText: getAdStatusText(publishStatus)
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

router.post('/unpublish', requireLogin, (req, res) => {
	let id = req.body.id;

	Ads.findByIdAndUpdate(id, {
		status: 4,
		statusText: getAdStatusText(4)
	}, (err) => {
		if (!err)
			res.json({ status: 1 });
	});
});

router.get('/getAllAds', requireLogin, (req, res, next) => {
	Ads.aggregate([

		// User collection
		{
			$lookup: {
				from: 'users',
				localField: 'ownerId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },

		// Power collection
		{
			$lookup: {
				from: 'powers',
				localField: '_id',
				foreignField: 'adId',
				as: 'power'
			}
		},
		{
			$unwind: {
				path: '$power',
				// ad collection, power collectionda herhangi eşleşme yapamasa bile ad'i döndür.
				preserveNullAndEmptyArrays: true
			}
		},

		{
			$group: {
				_id: {
					_id: '$_id',
					title: '$title',
					status: '$status',
					statusText: '$statusText',
					slug: '$slug',
					createdAt: '$createdAt',
					user: '$user'
				},
				power: {
					$push: '$power'
				},
				totalPower: {
					$sum: { $cond: [{ $gte: [ '$power.endingAt', new Date() ] }, '$power.powerNumber', 0] }
				}
			}
		},

		{
			'$project': {
				'_id': '$_id._id',
				'title': '$_id.title',
				'status': '$_id.status',
				'statusText': '$_id.statusText',
				'slug': '$_id.slug',
				'createdAt': '$_id.createdAt',
				'user': '$_id.user'
			},
		},
		{ $sort : { _id : -1 } },
	], (err, result)=>{
		if (err)
			return next(err);

		console.log(result);
		res.json(result);
	});
});

module.exports = router;
