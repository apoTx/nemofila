const express = require('express');
const router = express.Router();
const round = require('mongo-round');

const i18n = require('i18n');
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Ads = require('../models/ads');

// helpers
const getDayName = require('../helper/getDayName');
const openOrClose = require('../helper/openOrClose');

const adPerPage = 48;

/* GET home page. */
router.get( '/', ( req, res ) => {
	const location = req.query.location;
	const categoryId = req.query.categoryId;
	const subCategoryId = req.query.subCategoryId;
	const categoryName = req.query.categoryName;
	const subCategoryName = req.query.subCategoryName;
	const sortWith = req.query.sortWith;
	const openNowCheckbox = req.query.openNow === 'on' ? true : false;

	console.log(openNowCheckbox);

	let sort;
	if (sortWith === 'rate'){
		sort = { 'rate': -1 };
	}else{
		sort = { 'totalPower':-1, 'updateAt': -1 };
	}

	const url = req.protocol + '://' + req.get('host') + req.originalUrl;

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
				'place.address_components.long_name': location !== '' ? location : { $exists: true },
				'category.categoryId': categoryId ? ObjectId(categoryId) :  { $exists: true },
				'category.categoryChildId': subCategoryId ? ObjectId(subCategoryId) :  { $exists: true },
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

		// categories collection
		{
			$lookup: {
				from: 'categories',
				localField: 'category.categoryId',
				foreignField: '_id',
				as: 'category'
			}
		},
		{
			$unwind: {
				path: '$category',
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
					category: '$category',
					photoShowcaseIndex: '$photoShowcaseIndex',
					place: '$place',
					placeName: '$place.formatted_address',
					workTimes: '$workTimes',
					rate: { $ceil: { $avg: '$rates.score' } },
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
				place: '$_id.place',
				locationName: '$_id.placeName',
				category: '$_id.category.name',
				rate: round('$_id.rate', 1),
				workTimes: '$_id.workTimes',
				workTimesToday: '$_id.workTimes'+ '.'+ getDayName(),
			}
		}, // ,
		{ $sort: sort },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		const category = subCategoryName !== '' ? subCategoryName : categoryName;
		const locationTitle = (location !== '') && (location !== undefined)   ? 'in '+ location : '';
		const best = category !== '' ? i18n.__( 'best' ) : '';
		const title = `${best} ${category} ${locationTitle}`;

		data.forEach((ad, key) => {
			let status = openOrClose(data[key]);
			data[key].openNow = status;

			if (!status && openNowCheckbox){
				delete data[key];

			}
		});

		const d = { data };
		const result = Object.assign(d, {
			location,
			categoryId,
			subCategoryId,
			openNowCheckbox,
			adCount: data.length,
			adPerPage: adPerPage,
			page: req.query.page,
			url: url,
			title: title.trim() !== '' ? title : i18n.__( 'Search Results' )
		});


		res.render('search', result);
	});

});

router.get('/getEventsByLocationName', (req, res) => {
	const location = req.query.location;

	Ads.aggregate([
		{
			'$match': {
				'place.address_components.long_name': location !== '' ? location : { $exists: true },
				'status': 1,
			}
		},

		// ads collection
		{
			$lookup: {
				from: 'events',
				localField: '_id',
				foreignField: 'adId',
				as: 'event'
			}
		},
		{
			$match:{ 'event.status' : 1 }
		},
		{ '$unwind': '$event' },
		{ '$limit': 30 },
		{
			'$project': {
				'event': 1,
			},
		},
	], (err, result)=>{
		if (err)
			throw err;

		res.json(result);
	});
});

module.exports = router;
