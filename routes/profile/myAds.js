let express = require('express');
let moment = require('moment');
let router = express.Router();

// Models
let Ads = require('../../models/ads');

let requireLogin = require('../inc/requireLogin.js');
let getAdStatusText = require('../../helper/getAdStatusText');


/* GET users listing. */
router.get('/getMyAds', requireLogin, (req, res) => {
	let _id = req.session.user._id;

	Ads.aggregate([
		{
			'$match': {
				'ownerId': _id,
			}
		},

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
					slug: '$slug',
					price: '$price',
					status: '$status',
					statusText: '$statusText',
					photos: '$photos',
					photoShowcaseIndex: '$photoShowcaseIndex',
				},
				power: {
					$push: '$power'
				},
				totalActivePower: {
					$sum: { $cond: [{ $gte: [ '$power.endingAt', new Date() ] }, '$power.powerNumber', 0] }
				},
			}
		},
		{
			$project: {
				_id: '$_id._id',
				title: '$_id.title',
				slug: '$_id.slug',
				price: '$_id.price',
				status: '$_id.status',
				statusText: '$_id.statusText',
				photos: '$_id.photos',
				photoShowcaseIndex: '$_id.photoShowcaseIndex',
				powers: '$power',
				totalActivePower: 1
			}
		},
		{ $sort:{ 'createdAt': -1 } }
	], (err, data) => {
		if (err)
			throw new Error(err);

		console.log(data);
		res.json(data);
	});

	/*Ads.find({
		'ownerId': _id,
	},{
		'title': 1,
		'slug': 1,
		'uuid': 1,
		'photos': 1,
		'photoShowcaseIndex': 1,
		'price': 1,
		'status': 1,
		'statusText': 1,
	},(err, data)=>{
		if (err)
			console.log(err);

		res.json(data);
	}).sort({ createdAt: -1 });*/
});

router.post('/unpublish', requireLogin, (req, res) => {
	let id = req.body.id;

	Ads.findById(id, (err, data) => {
		if (data.status === 1) {
			Ads.findByIdAndUpdate(id, {
				status: 4,
				statusText: getAdStatusText(4)
			}, (err) => {
				if (!err)
					res.json({ status: 1 });
			});
		}else{
			res.json({ status: 1 });
		}
	});
});

router.post('/update', requireLogin, (req, res) => {
	let id = req.body.id;

	let endDate = moment(new Date()).subtract(2, 'days').format();

	Ads.findOne({
		'_id': id,
		'updateAt': { '$lt' : new Date(endDate) }
	}, (err, result) => {
		console.log(result);
	});
});

module.exports = router;
