const express = require('express');
const router = express.Router();
const round = require('mongo-round');

const i18n = require('i18n');
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Ads = require('../models/ads');

const getDayName = require('../helper/getDayName');

let adPerPage = 48;

/* GET home page. */
router.get( '/', ( req, res ) => {
	let location = req.query.location;
	let categoryId = req.query.categoryId;
	let subCategoryId = req.query.subCategoryId;
	let categoryName = req.query.categoryName;
	let subCategoryName = req.query.subCategoryName;
	let sortWith = req.query.sortWith;
	const openNow = req.query.openNow;

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
				category: '$_id.category.name',
				rate: round('$_id.rate', 1),
				workTimes: '$_id.workTimes'+ '.'+ getDayName(),
			}
		}, // ,
		{ $sort: sort },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false,
			hour: 'numeric',
			minute: 'numeric' });
		const category = subCategoryName !== '' ? subCategoryName : categoryName;
		const locationTitle = (location !== '') && (location !== undefined)   ? 'in '+ location : '';
		const best = category !== '' ? i18n.__( 'best' ) : '';
		const title = `${best} ${category} ${locationTitle}`;

		let d = { data: data };

		let result = Object.assign(d, {
			adCount: data.length,
			adPerPage: adPerPage,
			page: req.query.page,
			url: url,
			currentTime: currentTime,
			openNow: openNow === 'on' ? true : false,
			title: title.trim() !== '' ? title : i18n.__( 'Search Results' )
		});

		console.log(result.data);

		res.render('search', result);
	});
});

router.get('/getEventsByLocationName', (req, res) => {
	const location = req.query.location;

	Ads.aggregate([
		{
			'$match': {
				'place.address_components.long_name': location !== '' ? location : { $exists: true },
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
