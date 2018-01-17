let express = require('express');
let router = express.Router();

let i18n = require('i18n');
let ObjectId = require('mongoose').Types.ObjectId;

// Models
let Ads = require('../models/ads');

let adPerPage = 48;

/* GET home page. */
router.get( '/', ( req, res ) => {
	let location = req.query.location;
	let category = req.query.category;
	let categoryName = req.query.categoryName;
	let subCategoryName = req.query.subCategoryName;

	console.log(location);

	let pattern = /^[1-9]+$/;

	let page;
	if (!pattern.test(req.query.page))
		page = 1;
	else
		page = Math.abs(parseInt(req.query.page));

	let lastAd = (page -1) * adPerPage;


	Ads.aggregate([
		{
			'$match': {
				status: 1,
				title: new RegExp(req.query.title, 'i'),
				'place.address_components.short_name': location !== '' ? location : { $exists: true },
				'category.categoryId': category.categoryId ? ObjectId(category.categoryId) :  { $exists: true },
				'category.categoryChildId': category.categoryChildId ? ObjectId(category.categoryChildId) :  { $exists: true },
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
					updateAt: '$updateAt',
					photos: '$photos',
					photoShowcaseIndex: '$photoShowcaseIndex',
					place: '$place'
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
			$project: {
				_id: '$_id._id',
				title: '$_id.title',
				slug: '$_id.slug',
				updateAt: '$_id.updateAt',
				photos: '$_id.photos',
				photoShowcaseIndex: '$_id.photoShowcaseIndex',
				powers: '$power',
				totalPower: 1,
				place: '$_id.place.address_components'
			}
		},
		{ $sort: { 'totalPower':-1, 'updateAt': -1  } },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		const category = subCategoryName !== '' ? subCategoryName : categoryName;
		const locationTitle = location !== '' ? 'in '+ location : '';
		let d = { data: data };

		let result = Object.assign(d, {
			adCount: data.length,
			adPerPage: adPerPage,
			page: req.query.page,
			title: `${i18n.__( 'best' )} ${category} ${locationTitle}`
		});

		res.render('search', result);
	});
});

module.exports = router;
