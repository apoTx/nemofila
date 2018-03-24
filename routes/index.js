const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid');

const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const requireLogin = require('./inc/requireLogin.js');

// let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

// Models
const User = require('../models/users');
const Ads = require('../models/ads');
const forgotPasswords = require('../models/forgotPassword');
const Subscribe = require('../models/subscribes');

// helpers
const mailer = require('../helper/mailer');
const getDayName = require('../helper/getDayName');
const verifyRecaptcha = require('../helper/recaptcha');
const adminAdToUser = require('../helper/adminAdToUser');
const openOrClose = require('../helper/openOrClose');

const keySecret = 'sk_test_wTFYrL2DQjLQ3yALYPOfUWwg';
const stripe = require('stripe')(keySecret);

const adPerPage = 16;

/* GET home page. */
router.get( '/', ( req, res ) => {
	res.render('index', {
		page: req.query.page || 1,
		title: res.__('index_title'),
	});
});

router.get( '/env', ( req, res ) => {
	res.json({ env:  process.env.NODE_ENV });
});

router.get( '/login', ( req, res ) => {
	res.send('please login');
});

router.post( '/register', ( req, res ) => {
	verifyRecaptcha(req.body.recaptcha, (success) => {
		if (success) {
			const data = req.body.data;

			// Password hash
			const saltRounds = 10;
			bcrypt.hash(req.body.data.password, saltRounds).then((hash) => {
				let user = new User({
					'name': (data.name).replace(/\b\w/g, l => l.toUpperCase()),
					'surname': (data.surname).replace(/\b\w/g, l => l.toUpperCase()),
					'email': (data.email).toLowerCase(),
					'phone': data.phone,
					'password': hash
				});

				user.save((err, data) => {
					if (err){
						res.send(err);
					}else {
						adminAdToUser(data._id, req.cookies.adminAdUuid, () => {
							res.clearCookie('adminAdUuid');
							res.send({ 'status': 1 });
						});
					}
				});
			});
		}else{
			console.log('err');
			res.end('captcha err');
		}
	});

});

router.post('/login', (req,res) => {
	const process = () => {
		const data = req.body.data;
		const autoLogin = req.body.autoLogin;

		User.findOne({ email: data.email },(err,user) => {
			if(!user){
				res.json({ error: 'Email or password is did not match' });
			}else{
				if (autoLogin){
					req.session.user = user;
					res.json({ status: 1 });
				}else{
					bcrypt.compare(data.password, user.password, (err, r) => {
						if (r) {
							req.session.user = user;

							adminAdToUser(user._id, req.cookies.adminAdUuid, () => {
								res.clearCookie('adminAdUuid');
								res.json({ 'status': 1 });
							});
						}else{
							res.json({ error: 'Email or password is did not match' });
						}
					});
				}
			}
		});
	};

	if (req.body.autoLogin){
		process();
	}else{
		verifyRecaptcha(req.body.recaptcha, (success) => {
			if (success) {
				process();
			}else{
				console.log('err');
				res.json({ error: 'Captcha error.' });
			}
		});
	}
});

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
					place: '$place',
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
				place: '$_id.place',
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

router.post('/charge',  (req, res) => {
	const amount = parseInt(req.body.amount) * 1000;

	stripe.customers.create({
		email: req.body.email,
		card: req.body.id
	})
		.then(customer =>
			stripe.charges.create({
				amount,
				description: 'Buy Power',
				currency: 'eur',
				customer: customer.id
			}))
		.then(charge => res.send(charge))
		.catch(err => {
			console.log('Error:', err);
			res.status(500).send({ error: 'Purchase Failed' });
		});
});

router.post('/forgotPassword',  (req,res) => {
	User.findOne({ email: req.body.email },(err,user) => {
		if(!user){
			res.json({ error: 'This email was not found.' });
		}else{

			let _uuid = uuid.v1();

			// update old forgot password requests status
			forgotPasswords.update({ userId: user._id,  status: true }, {
				$set: {
					status: false
				}
			}, () => {
				// save to db
				let forgot = new forgotPasswords({
					userId: user._id,
					uuid: _uuid
				});

				forgot.save((err) => {
					if (err)
						throw(err);
				});
			});

			// send email
			const to_email = req.body.email.trim();
			const mailOptions = {
				from: mailer.config.defaultFromAddress,
				to: to_email,
				subject: 'Password reset request',
				template: 'forgot-password',
				context: {
					siteUrl: mailer.siteUrl,
					email : to_email,
					uuid: _uuid
				}
			};

			mailer.transporter.sendMail(mailOptions, (error, info) => {
				if(error){
					console.log(error);
					res.json({ error: 'Email was not send.' });
				}else{
					console.log('Message sent: ' + info.response);
					res.json({ status: 1 });
				}
			});
		}
	});
});

router.post('/subscribe',  (req, res) => {
	const email = req.body.email;

	const subscribe = new Subscribe({
		email: email
	});

	Subscribe.findOne({ email: email }, (err, data) => {
		if (data === null) {
			subscribe.save((err) => {
				if (err)
					res.json({ error: 'Email was not saved.' });

				res.json({ status: 1 });
			});
		}else{
			res.json({ error: 'Your email address allready saved.' });
		}
	});
});

router.get('/logout',  (req,res) => {
	req.session.reset();
	res.redirect('./');
});

router.get('/getIndexAds', (req,res) => {
	const pattern = /^[1-9]+$/;

	let page;
	if (!pattern.test(req.query.page))
		page = 1;
	else
		page = Math.abs(parseInt(req.query.page));

	const lastAd = (page -1) * adPerPage;

	Ads.aggregate([
		{
			'$match': {
				'status': 1,
				userSelectDelete: false,
			}
		},

		// Power collection

		/*
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
		*/

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
					description: '$description',
					slug: '$slug',
					photos: '$photos',
					updateAt: '$updateAt',
					category: '$category',
					workTimes: '$workTimes',
					place: '$place',
					placeName: '$place.formatted_address',
					photoShowcaseIndex: '$photoShowcaseIndex',
					rateAvg: { $ceil: { $avg: '$rates.score' } },
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
				description: '$_id.description',
				rate: '$_id.rateAvg',
				slug: '$_id.slug',
				updateAt: '$_id.updateAt',
				photos: '$_id.photos',
				photoShowcaseIndex: '$_id.photoShowcaseIndex',
				workTimesToday: '$_id.workTimes'+ '.'+ getDayName(),
				place: '$_id.place',
				locationName: '$_id.placeName',
				powers: '$power',
				category: res.__('$_id.category.name'),
				totalPower: 1,
			}
		},
		{ $sort: { 'totalPower':-1, 'updateAt': -1 } },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		Ads.count({ status: 1 }, (err, count) => {
			data.forEach((ad, key) => {
				data[key].openNow = openOrClose(data[key]);
				data[key].category = res.__(data[key].category);
			});

			const d = { data: data };
			const result = Object.assign(d, { dayName: getDayName(), adCount: count, adPerPage: adPerPage, page: req.query.page  });

			res.json(result);
		});
	});
});

router.get('/searchAd', (req, res) => {
	const location = JSON.parse(req.query.location);
	const category = JSON.parse(req.query.category);

	const pattern = /^[1-9]+$/;

	let page;
	if (!pattern.test(req.query.page))
		page = 1;
	else
		page = Math.abs(parseInt(req.query.page));

	const lastAd = (page -1) * adPerPage;


	Ads.aggregate([
		{
			'$match': {
				status: 1,
				userSelectDelete: false,
				title: new RegExp(req.query.title, 'i'),
				'location.countryId': location.countryId ? ObjectId(location.countryId) :  { $exists: true },
				'location.cityId': location.cityId ? ObjectId(location.cityId) :  { $exists: true },
				'location.districtId': location.districtId ? ObjectId(location.districtId) :  { $exists: true },
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
				totalPower: 1
			}
		},
		{ $sort: { 'totalPower':-1, 'updateAt': -1  } },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		Ads.count({ status: 1 }, (err, count) => {
			const d = { data: data };
			const result = Object.assign(d, { adCount: count, adPerPage: adPerPage, page: req.query.page  });

			res.json(result);
		});
	});
});

// Get angular partials
router.get('/partials/:folder/:filename', (req, res) => {
	const folder = req.params.folder;
	const filename = req.params.filename;
	res.render('partials/'+ folder +'/'+ filename);
});

// localization
router.get('/es', (req, res) => {
	res.cookie('locale', 'es');
	res.redirect('/');
});

router.get('/tr', (req, res) => {
	res.cookie('locale', 'tr');
	res.redirect('/');
});

router.get('/en', (req, res) => {
	res.cookie('locale', 'en');
	res.redirect('/');
});

module.exports = router;
