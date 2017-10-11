let express = require('express');
let bcrypt = require('bcryptjs');

let router = express.Router();

// Models
let User = require('../models/users');
let Ads = require('../models/ads');

// Mail transporter
let transporter = require('../helper/mailer');

let hbs = require('nodemailer-express-handlebars');
let options = {
	viewEngine: {
		extname: '.hbs',
		layoutsDir: 'views/mailer/',
		defaultLayout : 'template',
		partialsDir : 'views/mailer/partials/'
	},
	viewPath: 'views/mailer/',
	extName: '.hbs'
};

transporter.use('compile', hbs(options));


/* GET home page. */
router.get( '/', ( req, res ) => {
	res.render('index', { title:'Easy Ads', user: req.session.user });
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

router.post('/forgotPassword',  (req,res) => {
	User.findOne({ email: req.body.email },(err,user) => {
		if(!user){
			res.json({ error: 'This email was not found.' });
		}else{
			// send email
			let mailOptions = {
				from: 'Easyad <email@gmail.com>',
				to: req.body.email.trim(),
				subject: 'Password reset request',
				text: 'Reset your password?',
				template: 'email_body',
				context: {
					variable1 : 'value1',
					variable2 : 'value2'
				}
			};

			transporter.sendMail(mailOptions, (error, info) => {
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

router.get('/logout',  (req,res) => {
	req.session.reset();
	res.redirect('./');
});

router.get('/getIndexAds', (req,res) => {
	Ads.find({
	},{
		'title': true,
		'photos': true,
		'uuid': true,
		'slug': true,
		'photoShowcaseIndex': true
	},(err, data)=>{
		if (err)
			console.log(err);

		res.json(data);
	}).sort({ '$natural': -1 }).limit(8);
});

router.get('/searchAd', (req, res) => {
	let location = JSON.parse(req.query.location);
	let category = JSON.parse(req.query.category);

	Ads.find({
		title: new RegExp(req.query.title, 'i'),
		'location.countryId': location.countryId ? location.countryId :  { $exists: true },
		'location.cityId': location.cityId ? location.cityId :  { $exists: true },
		'location.districtId': location.districtId ? location.districtId :  { $exists: true },
		'category.categoryId': category.categoryId ? category.categoryId :  { $exists: true },
		'category.categoryChildId': category.categoryChildId ? category.categoryChildId :  { $exists: true },
	}, (err, data) => {
		if (err)
			throw(err);

		res.json(data);
	}).sort({ '$natural': -1 }).limit(16);
});

// Get angular partials
router.get('/partials/:folder/:filename', (req, res) => {
	let folder = req.params.folder;
	let filename = req.params.filename;
	res.render('partials/'+ folder +'/'+ filename);
});



module.exports = router;
