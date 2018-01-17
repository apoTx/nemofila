const express = require('express');
const request = require('request');
const router = express.Router();

// settings
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

router.get( '/', ( req, res) => {
	res.send('events');
});

router.get( '/new/:adId', ( req, res) => {
	request('http://jqueryegitimseti.com/amazon-service.php', (error, response, body) => {
		res.render( 'new-event', {
			title: res.__('new-event-page-title'),
			userExists: req.session.user ? true : false,
			id: req.query.id ? req.query.id : 'false',
			formdata: JSON.parse(body),
			amazon_base_url: config.amazon_s3.photo_base_url,
		});
	});
});

module.exports = router;
