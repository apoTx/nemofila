const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');
const numeral = require('numeral');
const geoTz = require('geo-tz')

const ObjectId = mongoose.Types.ObjectId;

const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

const requireLogin = require('./inc/requireLogin.js');

// Models
const Ads = require('../models/ads');
const Favourites = require('../models/favourites');

const getObject = (data, req, res) => {

	// For category
	let childCategoryName;
	try{
		childCategoryName = (data.categoryObj.subCategories).find(x => String(x._id) === String(data.category.categoryChildId)).name;
	}catch(e){
		childCategoryName = null;
	}

	// For location
	/*let cityObj = (data.locationObj.cities).find(x => String(x._id) === String(data.location.cityId));
	let cityName = cityObj.name;

	let districtName;
	try{
		districtName = (cityObj.districts).find(x => String(x._id) === String(data.location.districtId)).name;
	}catch (e){
		districtName = null;
	}*/

	const viewRate = (val) => {
		if (val === null){
			return res.__('No reviews yet');
		}

		if (val % 1 === 0){
			return val.toFixed(0);
		}else{
			return val.toFixed(1);
		}
	}

	const tzMoment = geoTz.tzMoment(data.place.geometry.location.lat, data.place.geometry.location.lng);
	const now_local_time = moment.parseZone(tzMoment).format('H:m');


	return {
		title: data.title + ' ' + data.categoryObj.name + ','+ data.place.address_components[0].short_name,
		data: data,
		moment: moment,
		url: req.protocol + '://' + req.get('host') + req.originalUrl,
		session: req.session.user,
		place: data.place,
		rate: Math.round(data.rate),
		viewRate: viewRate(data.rate),
		pageView: numeral(data.pageView).format('0a'),
		category: {
			name: data.categoryObj.name,
			childCategoryName: childCategoryName,
		},
		/*location: {
			name: data.locationObj.name,
			cityName: cityName,
			districtName: districtName
		},*/
		amazon_base_url: config.amazon_s3.photo_base_url,
		events: data.events
	};
};

router.get('/:slug/:id', (req, res, next) => {
	let _id;
	try{
		_id = new ObjectId(req.params.id);
	}catch(e){
		_id = '';
	}


	Ads.aggregate([
		{
			'$match': {
				'_id': _id,
			}
		},

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

		// Event collection
		/*{
			$lookup: {
				from: 'events',
				localField: '_id',
				foreignField: 'adId',
				as: 'event'
			}
		},
		{
			$unwind: {
				path: '$event',
				preserveNullAndEmptyArrays: true
			}
		},*/

		// categories collection
		{
			$lookup: {
				from: 'categories',
				localField: 'category.categoryId',
				foreignField: '_id',
				as: 'categoryObj'
			}
		},
		{ '$unwind': '$categoryObj' },

		// countries collection
		/*{
			$lookup: {
				from: 'countries',
				localField: 'location.cityId',
				foreignField: 'cities._id',
				as: 'locationObj'
			}
		},
		{ '$unwind': '$locationObj' },*/


		{
			$group: {
				'_id': {
					'_id': '$_id',
					'title': '$title',
					'description': '$description',
					'price': '$prica',
					'anotherContact': '$anotherContact',
					'uuid': '$uuid',
					'ownerId': '$ownerId',
					'status': '$status',
					'phone': '$phone',
					'place': '$place',
					'mobile_phone': '$mobile_phone',
					'website': '$website',
					'address': '$address',
					'photoShowcaseIndex': '$photoShowcaseIndex',
					'photos': '$photos',
					'listingDate': '$listingDate',
					'category': '$category',
					'categoryObj': '$categoryObj',
					'pageView': '$pageView',
					'user': '$user',
					'rateAvg': { $avg: '$rates.score' }
				},
				'events': {
					$push: '$event'
				}
			}
		},

		{
			'$project': {
				_id: '$_id._id',
				'title': '$_id.title',
				'rate': '$_id.rateAvg',
				'description': '$_id.description',
				'price': '$_id.price',
				'anotherContact': '$_id.anotherContact',
				'uuid': '$_id.uuid',
				'ownerId': '$_id.ownerId',
				'status': '$_id.status',
				'phone': '$_id.phone',
				'place': '$_id.place',
				'mobile_phone': '$_id.mobile_phone',
				'website': '$_id.website',
				'address': '$_id.address',
				'photoShowcaseIndex': '$_id.photoShowcaseIndex',
				'photos': '$_id.photos',
				'listingDate': '$_id.listingDate',
				'pageView': '$_id.pageView',
				'user.name': '$_id.user.name',
				'user._id': '$_id.user._id',
				'user.surname': '$_id.user.surname',
				'user.phone': '$_id.user.phone',
				'category': '$_id.category',
				'categoryObj': '$_id.categoryObj',
				'events': '$events'
			},
		},

		{ $limit: 1 },
	], (err, result)=>{
		if (err)
			return next(err);


		if(result.length < 1){
			res.status(404).render('error/404', { message: 'Ad Not Found' });
		}else{
			let data = result[0];

			if( data.status !== 1){
				if ( req.session.user ){
					if (String(data.ownerId) == req.session.user._id || req.session.user.isAdmin)
						res.render( 'detail', getObject(data, req, res));
					else
						res.status(404).render('error/404', { message: 'Ad Not Found' });
				}else{
					res.status(404).render('error/404', { message: 'Ad Not Found' });
				}
			}else {

				Ads.findByIdAndUpdate(
					ObjectId(_id),
					{ $inc: { 'pageView': 1 } },
					(err) => {
						if (err)
							throw new Error(err);
					}
				);

				res.render( 'detail', getObject(data, req ,res));
			}
		}
	});
});

router.get('/getSimilars', (req, res) => {
	const adId = req.query.adId;

	/*eslint-disable*/
	let findData;
	/*eslint-enable*/

	Ads.findById(adId, (err, result) => {
		const categoryId = result.category.categoryId;
		// const childCategoryId = result.category.categoryChildId;
		const location = result.place.address_components[0].long_name;

		//if (childCategoryId === null){
		findData = { 'category.categoryId': categoryId, 'place.address_components.0.long_name': location };
		//}else{
		//findData = { 'category.categoryChildId': childCategoryId, 'place.address_components[0].long_name': location };
		//}

		Ads.find(findData, (err, data) => {
			res.json(data);
		}).limit(8);

	});
});

router.get('/addFavourites', requireLogin, (req, res) => {
	let fav = new Favourites({
		userId: req.query.userId,
		adId: req.query.adId,
		type: req.query.type
	});

	fav.save((err) => {
		if (err)
			res.send(err);
		else
			res.json({ status: 1 });
	});
});

router.get('/delFavourites', requireLogin, (req, res) => {
	Favourites.findOneAndRemove({
		userId: req.query.userId,
		adId: req.query.adId
	},(err) => {
		if (err)
			res.send(err);
		else
			res.json({ status: 1 });
	});
});

router.get('/isFav', requireLogin, (req, res) => {
	Favourites.findOne( {
		userId: req.query.userId,
		adId: req.query.adId
	},(err, response) => {
		if (err)
			res.send(err);
		else
			res.json({ isFav: response == null ? false : true });
	});
});

router.get('/setRate', requireLogin, (req, res) => {


	Ads.findOneAndUpdate({
		_id: req.query.adId
	},{
		$push: {
			rates: {
				userId: req.session.user._id,
				score: req.query.score
			},
		}
	},{
		upsert: true,
		new: true
	}, (err, result) => {
		if (err)
			throw err;

		res.json(result);
	});
});

module.exports = router;
