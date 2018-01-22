const express = require('express');
const request = require('request');
let slugify = require('slugify');
const router = express.Router();

// Models
let Events = require('../models/events');

// settings
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
const verifyRecaptcha = require('../helper/recaptcha');

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
				adId: req.body.adId
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

module.exports = router;
