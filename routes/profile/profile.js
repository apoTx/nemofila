let express = require('express');
let router = express.Router();
let config = require('../../config/env.json')[process.env.NODE_ENV || 'development'];
let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/', requireLogin, (req, res) => {
	res.render( 'profile', {
		title: 'Profile',
		amazon_base_url: config.amazon_s3.photo_base_url
	});
});

module.exports = router;
