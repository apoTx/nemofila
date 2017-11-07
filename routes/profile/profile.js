let express = require('express');
let router = express.Router();
let config = require('../../config/env.json')[process.env.NODE_ENV || 'development'];
let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/', requireLogin, (req, res) => {
	res.render( 'profile', {
		title: 'Profile',
		amazon_base_url: config.amazon_s3.photo_base_url,
		i18n: res,
		profile_locales: {
			myAds: {
				title: res.__('my_ads'),
				no_results: res.__('no_results'),
				settings: res.__('settings'),
				edit: res.__('edit'),
				buy_power: res.__('buy_power'),
				unpublish: res.__('unpublish')
			}
		},
	});
});

module.exports = router;
