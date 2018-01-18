let express = require('express');
let slugify = require('slugify');
let request = require('request');
let uuid = require('uuid');

let router = express.Router();

// settings
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

// Models
let Ads = require('../models/ads');
let Power = require('../models/powers');

// Mail transporter
let mailer = require('../helper/mailer');
let verifyRecaptcha = require('../helper/recaptcha');
let getAdStatusText = require('../helper/getAdStatusText');
let requireLogin = require('./inc/requireLogin.js');

let sendMail = (title, id) => {
	// send email
	let to_email = mailer.config.new_ad_alert_to_email;
	let subject = 'There\'s a new ad that is pending approval';
	let mailOptions = {
		from: mailer.config.defaultFromAddress,
		to: to_email,
		subject: subject,
		template: 'admin/new-ad-alert',
		context: {
			siteUrl: mailer.siteUrl,
			adTitle: title,
			id: id,
			subject: subject,
		}
	};

	mailer.transporter.sendMail(mailOptions, (error, info) => {
		if(error)
			console.log(error);
		else
			console.log('Message sent: ' + info.response);
	});
};

router.get('/:id?', requireLogin, (req, res) => {
	request('http://jqueryegitimseti.com/amazon-service.php', (error, response, body) => {
		res.render( 'newAd', {
			title: 'New Ad',
			userExists: req.session.user ? true : false,
			id: req.query.id ? req.query.id : 'false',
			formdata: JSON.parse(body),
			amazon_base_url: config.amazon_s3.photo_base_url,
		});
	});
});

router.post('/create', requireLogin, (req, res) => {

	verifyRecaptcha(req.body.recaptcha, (success) => {
		if (success) {
			const data = req.body.data;
			const powerData = req.body.power;
			const photos = req.body.photos;
			const _uuid = req.body.uuid  || uuid.v1();
			const showcaseIndex = req.body.showcaseIndex;
			// let country = req.body.country;
			const category = req.body.category;
			const isEdit = req.body.isEdit;
			const editId = req.body.editId;
			const phone = data.phone;
			const mobile_phone = data.mobile_phone;
			const address = data.address;
			const website = data.website;
			const place = data.place;

			const obj = {
				title: data.title,
				slug: slugify(data.title, { lower:true }),
				description: data.description,
				photos: photos,
				photoShowcaseIndex: showcaseIndex,
				uuid: _uuid,
				phone: phone,
				mobile_phone: mobile_phone,
				address: address,
				website: website,
				place: place,
				category: {
					categoryId: category.categoryId,
					categoryChildId: category.childCategoryId
				}
			};

			if (data.anotherContact.checked){
				Object.assign( obj,  {
					anotherContact: {
						checked: data.anotherContact.checked,
						name: data.anotherContact.name,
						phone: data.anotherContact.phone
					}
				});
			}

			if (!isEdit) {
				const ad = new Ads(Object.assign(obj, { ownerId: req.session.user._id }));

				ad.save((err, data) => {
					if (err) {
						throw new Error( err );
					} else {
						sendMail(data.title, data._id);

						if (powerData.powerStatus){
							let power = new Power ({
								adId: data._id,
								powerNumber: powerData.powerNumber,
								price: powerData.powerNumber * 10,
							});

							power.save((err) => {
								if (err)
									throw new Error( err );
							});
						}

						res.send( { 'status': 1 } );
					}
				});
			}else {
				Ads.findOneAndUpdate({ '_id': editId }, Object.assign(obj, { status: 0, statusText: getAdStatusText(0) }), { upsert:true }, (err, data) => {
					if (err)
						throw new Error(err);

					sendMail(data.title, data._id);
					res.send( { 'status': 1 } );
				});
			}
		} else {
			res.end('Captcha failed, sorry.');
		}
	});
});

router.get('/getEditAd/:id', requireLogin, (req,res) => {
	Ads.findById( req.params.id, (err,data) => {
		if (err)
			throw new Error();

		res.json(data);
	});
});

module.exports = router;
