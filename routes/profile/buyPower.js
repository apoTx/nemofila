let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();

// Models
let Ads = require('../../models/ads');
let Power = require('../../models/powers');

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/getAdById', requireLogin, (req, res) => {
	let id = req.query.id;

	Ads.aggregate([
		{
			'$match': {
				'_id': mongoose.Types.ObjectId(id),
				'status': 1,
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
				}
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
		{ $limit: 1 }
	], (err, data) => {
		if (err)
			throw new Error(err);

		let result = data[0];
		res.json(result);
	});
});

router.post('/savePower', requireLogin, (req, res) => {
	let adId = req.body.adId;
	let powerNumber = req.body.powerNumber;

	let power = new Power ({
		adId: adId,
		powerNumber: powerNumber,
		price: powerNumber * 10,
	});

	power.save((err) => {
		if (err)
			throw new Error( err );

		res.json({ 'status': 1 });
	});
});

module.exports = router;
