let express = require('express');
let bcrypt = require('bcryptjs');
let uuid = require('uuid');

let ObjectId = require('mongoose').Types.ObjectId;
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

let router = express.Router();

// Models
let User = require('../models/users');
let Ads = require('../models/ads');
let forgotPasswords = require('../models/forgotPassword');
let Subscribe = require('../models/subscribes');

// Mail transporter
let mailer = require('../helper/mailer');

const keySecret = 'sk_test_wTFYrL2DQjLQ3yALYPOfUWwg';
const stripe = require('stripe')(keySecret);

let adPerPage = 48;


router.get( '/env', ( req, res ) => {
	res.json({ env:  process.env.NODE_ENV});
});

/* GET home page. */
router.get( '/', ( req, res ) => {
	res.render('index', {
		page: req.query.page || 1,
		i18n: res,
		title: res.__('index_title'),
		user: req.session.user,
		locale: req.cookies.locale || 'en',
		amazon_base_url: config.amazon_s3.photo_base_url
	});
});

router.get( '/login', ( req, res ) => {
	res.send('please login');
});

router.post( '/register', ( req, res ) => {
	let data = req.body.data;

	// Password hash
	const saltRounds = 10;
	bcrypt.hash(req.body.data.password, saltRounds).then((hash) => {
		let user = new User({
			'name': data.name,
			'surname': data.surname,
			'email': data.email,
			'phone': data.phone,
			'password': hash
		});

		user.save((err) => {
			if (err)
				res.send(err);
			else
				res.send({ 'status': 1 });
		});
	});
});

router.post('/login', (req,res) => {
	let data = req.body.data;
	let autoLogin = req.body.autoLogin;

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
						res.json({ status: 1 });
					}else{
						res.json({ error: 'Email or password is did not match' });
					}
				});
			}
		}
	});
});

router.post('/charge',  (req, res) => {
	let amount = parseInt(req.body.amount) * 1000;

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
			let to_email = req.body.email.trim();
			let mailOptions = {
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
	let email = req.body.email;

	let subscribe = new Subscribe({
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
				photos: '$_id.photos',
				photoShowcaseIndex: '$_id.photoShowcaseIndex',
				powers: '$power',
				totalPower: 1
			}
		},
		{ $sort: { 'totalPower':-1 } },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		Ads.count({ status: 1 }, (err, count) => {
			let d = { data: data };
			let result = Object.assign(d, { adCount: count, adPerPage: adPerPage, page: req.query.page  });

			res.json(result);
		});
	});
});

router.get('/searchAd', (req, res) => {
	let location = JSON.parse(req.query.location);
	let category = JSON.parse(req.query.category);

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
				photos: '$_id.photos',
				photoShowcaseIndex: '$_id.photoShowcaseIndex',
				powers: '$power',
				totalPower: 1
			}
		},
		{ $sort: { 'totalPower':-1 } },
		{ $skip: lastAd },
		{ $limit: adPerPage }
	], (err, data) => {
		if (err)
			throw new Error(err);

		Ads.count({ status: 1 }, (err, count) => {
			let d = { data: data };
			let result = Object.assign(d, { adCount: count, adPerPage: adPerPage, page: req.query.page  });

			res.json(result);
		});
	});
});

// Get angular partials
router.get('/partials/:folder/:filename', (req, res) => {
	let folder = req.params.folder;
	let filename = req.params.filename;
	res.render('partials/'+ folder +'/'+ filename);
});


// Static pages
router.get('/services', (req, res) => {
	res.render('services', {
		i18n: res,
		title: res.__('services_page_title'),
	});
});

router.get('/contact', (req, res) => {
	res.render('contact', {
		i18n: res,
		title: res.__('contact_page_title'),
	});
});

router.get('/terms', (req, res) => {
	res.render('terms', {
		i18n: res,
		title: res.__('terms_page_title'),
	});
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
