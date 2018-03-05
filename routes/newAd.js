const express = require('express');
const slugify = require('slugify');
const request = require('request');
const uuid = require('uuid');

const router = express.Router();

// settings
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

// Models
const Ads = require('../models/ads');
const Power = require('../models/powers');

// Mail transporter
const mailer = require('../helper/mailer');

// helpers
const verifyRecaptcha = require('../helper/recaptcha');
const getAdStatusText = require('../helper/getAdStatusText');
const requireLogin = require('./inc/requireLogin.js');

const mailTemplate = {
	defaultTemplate: 'admin/new-ad-alert',
	adminAdTemplate: 'new-ad-alert-from-admin'
};
const to_email = mailer.config.new_ad_alert_to_email;
const subject = 'There\'s a new ad that is pending approval';
const subject_for_from_admin = 'Your ad was added';

const sendMail = (title, id, isAdmin, template, to, uuid, slug) => {
	const mailOptions = {
		from: mailer.config.defaultFromAddress,
		to: to ? to : to_email,
		subject: isAdmin ?  subject_for_from_admin : subject,
		template: template ? template : mailTemplate.defaultTemplate,
		context: {
			siteUrl: mailer.siteUrl,
			adTitle: title,
			id: id,
			subject: subject,
			uuid: uuid,
			slug: slug
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
			isAdmin: req.isAdmin,
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
			const zip_code = data.zip_code;
			const address = data.address;
			const website = data.website;
			const place = data.place;

			delete place.photos;

			const slug = slugify(data.title, { lower:true });

			const obj = {
				title: data.title,
				slug: slug,
				description: data.description,
				description2: data.description2,
				photos: photos,
				photoShowcaseIndex: showcaseIndex,
				uuid: _uuid,
				phone: phone,
				zipCode: zip_code,
				address: address,
				website: website,
				place: place,
				category: {
					categoryId: category.categoryId,
					categoryChildId: category.childCategoryId
				},
				workTimes: data.workTimes,
				adminAd: req.isAdmin,
				toEmailAddress: data.toEmailAddress,
				status: req.isAdmin ? 1 : 0,
				statusText: req.isAdmin ? getAdStatusText(1) : getAdStatusText(0),
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

						if (req.isAdmin)
							sendMail(data.title, data._id, req.isAdmin, mailTemplate.adminAdTemplate, obj.toEmailAddress, _uuid, slug);
						else
							sendMail(data.title, data._id, req.isAdmin);

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


					sendMail(data.title, data._id, req.isAdmin);

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
