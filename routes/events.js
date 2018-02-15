const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const moment = require('moment');
const slugify = require('slugify');
const router = express.Router();

// Models
const Events = require('../models/events');

// settings
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
const verifyRecaptcha = require('../helper/recaptcha');
const ObjectId = mongoose.Types.ObjectId;

//helpers
const requireLogin = require('./inc/requireLogin.js');
const getAdStatusText = require('../helper/getAdStatusText');


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
			eventId: req.query.eventId,
			amazon_base_url: config.amazon_s3.photo_base_url,
		});
	});
});

router.post( '/new', ( req, res) => {
	verifyRecaptcha(req.body.recaptcha, (success) => {
		if (success) {
			const data = req.body.data;
			const isEdit = req.body.isEdit;

			const listingDate = moment(data.startDate).subtract(data.listingDaysAgo, 'd').format();

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
				endDate: data.endDate,
				listingDaysAgo: data.listingDaysAgo,
				listingDate: listingDate
			};

			if (!isEdit) {

				const event = new Events( obj );

				event.save( obj, (err) => {
					if (err)
						throw new Error( err );

					res.json( { 'status': 1 } );
				} );

			}else{
				console.log(req.body.eventId);

				Events.findOneAndUpdate({ '_id': req.body.eventId }, Object.assign(obj, { status: 0, statusText: getAdStatusText(0) }), { upsert:true }, (err, data) => {
					if (err)
						throw new Error(err);

					//sendMail(data.title, data._id);
					res.send( { 'status': 1 } );
				});

			}

		}else{
			console.log('err');
			res.end('captcha err');
		}
	});
});

router.get( '/getIndexEvents', (req, res) => {
	Events.find({
		listingDate: { $lte: new Date() },
		endDate: { $gte:  new Date() }
	}, (err, data) => {
		res.json(data);
	})
		.limit(12)
		.sort({ _id: -1 });
});

router.get( '/getEventsByEventId', (req, res) => {
	Events.findById( req.query.eventId , (err, data) => {
		res.json(data);
	});
});

router.get( '/getEventsByAdId', (req, res) => {
	Events.find({
		adId: req.query.adId,
		listingDate: { $lte: new Date() },
		endDate: { $gte:  new Date() }
	}, (err, data) => {
		res.json(data);
	})
		.limit(12)
		.sort({ _id: -1 });
});

router.get( '/getMyEvents', requireLogin, (req, res) => {
	console.log();
	Events.find({
		ownerId: req.session.user._id,
	}, (err, data) => {
		console.log(data);
		res.json(data);
	})
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
				'startDate': 1,
				'endDate': 1,
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

		console.log(result[0]);
		res.render('event-detail', {
			session: req.session.user,
			data: result[0],
			moment: moment,
			url: req.protocol + '://' + req.get('host') + req.originalUrl,
			title: res.__('Best') + ' '+ res.__('event') + ' '+ result[0].title + ' ' + res.__('in') + ' '+ result[0].ad.place.address_components[0].short_name
		});
	});
});

module.exports = router;
