const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
let slugify = require('slugify');
const router = express.Router();

// Models
const Events = require('../models/events');

// settings
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
const verifyRecaptcha = require('../helper/recaptcha');
const ObjectId = mongoose.Types.ObjectId;

router.get( '/', ( req, res) => {
	res.send('events');
});

router.get( '/new/:adId', ( req, res) => {
	request('http://jqueryegitimseti.com/amazon-service.php', (error, response, body) => {
		res.render( 'new-event', {
			title: res.__('new-event-page-title'),
			userExists: !!req.session.user,
			id: req.params.adId ? req.params.adId : 'false',
			formdata: JSON.parse(body),
			amazon_base_url: config.amazon_s3.photo_base_url,
		});
	});
});

router.post( '/new', ( req, res) => {
	verifyRecaptcha(req.body.recaptcha, (success) => {
		if (success) {
			const data = req.body.data;
			const obj = {
				title: data.title,
				slug: slugify(data.title, { lower:true }),
				description: data.description,
				photos: req.body.photos,
				photoShowcaseIndex: req.body.showcaseIndex,
				categoryId: req.body.data.eventCategory,
				ownerId: req.session.user._id,
				adId: req.body.adId,
				startDate: data.startDate,
				endDate: data.endDate
			};
			const event = new Events(obj);

			event.save(obj, (err) => {
				if (err)
					throw new Error( err );

				res.json( { 'status': 1 } );
			});

		}else{
			console.log('err');
			res.end('captcha err');
		}
	});
});

router.get( '/getIndexEvents', (req, res) => {
	Events.find({
		startDate: { $lte: new Date() },
		endDate: { $gte:  new Date() }
	}, (err, data) => {
		res.json(data);
	})
		.limit(12)
		.sort({ _id: -1 });
});

router.get( '/detail/:slug/:id', (req, res, next) => {
	let _id;
	try{
		_id = new ObjectId(req.params.id);
	}catch(e){
		_id = '';
	}


	Events.aggregate([
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

		// categories collection
		{
			$lookup: {
				from: 'categories',
				localField: 'categoryId',
				foreignField: '_id',
				as: 'category'
			}
		},
		{ '$unwind': '$category' },

		// ads collection
		{
			$lookup: {
				from: 'ads',
				localField: 'adId',
				foreignField: '_id',
				as: 'ad'
			}
		},
		{ '$unwind': '$ad' },

		{ $limit: 1 },
		{
			'$project': {
				'title': 1,
				'description': 1,
				'status': 1,
				'photoShowcaseIndex': 1,
				'photos': 1,
				'user.name': 1,
				'user._id': 1,
				'user.surname': 1,
				'user.phone': 1,
				'category._id': 1,
				'category.name': 1,
				'pageView': 1,
				'ad': '$ad',
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);

		res.json(result);
	});
});

module.exports = router;
