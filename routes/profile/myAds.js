let express = require('express');
let moment = require('moment');
let mongoose = require('mongoose');
let router = express.Router();

// Models
let Ads = require('../../models/ads');

let requireLogin = require('../inc/requireLogin.js');
let getAdStatusText = require('../../helper/getAdStatusText');

/* GET users listing. */
router.get('/getMyAds', requireLogin, (req, res) => {
	let _id = req.session.user._id;
	let endDate = moment(new Date()).subtract(2, 'days').format();

	Ads.aggregate([
		{
			'$match': {
				'ownerId': mongoose.Types.ObjectId(_id),
				userSelectDelete: false
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
					updateAt: '$updateAt',
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
				totalActivePower: 1,
				updateble: {
					$cond: [
						{ $lt: ['$_id.updateAt',  new Date(endDate) ] }, // if
						true, // then
						false // else
					]
				}
			}
		},
		{ $sort:{ '_id': -1 } }
	], (err, data) => {
		if (err)
			throw new Error(err);

		res.json(data);
	});
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
	}, (err, ad) => {
		ad.updateAt = new Date();
		ad.save((err) => {
			if (err){
				console.log(err);
				res.json({ 'err': 'error' });
			}

			res.json({ 'status': 1 });
		});
	});
});

module.exports = router;
