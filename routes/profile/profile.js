let express = require('express');
let router = express.Router();
let config = require('../../config/env.json')[process.env.NODE_ENV || 'development'];
let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/', requireLogin, (req, res) => {
	res.render( 'profile', {
		title: 'Profile',
		amazon_base_url: config.amazon_s3.photo_base_url,
		profile_locales: {
			myAds: {
				title: res.__('my_ads'),
				no_results: res.__('no_results'),
				settings: res.__('settings'),
				edit: res.__('edit'),
				new_event: res.__('new_event'),
				update: res.__('Update'),
				buy_power: res.__('buy_power'),
				unpublish: res.__('unpublish')
			},
			myEvents: {
				title: res.__( 'My Events' ),
			},
			messages: {
				title: res.__('messages'),
				search: res.__('searchPlaceholder'),
			},
			favourites: {
				title: res.__('favourites')
			},
			buyPower: {
				title: res.__('buy_power'),
				power_up_text1: res.__('power_up_text1'),
				power_up_text2: res.__('power_up_text2'),
				buy_power_btn: res.__('buy_power_btn'),
				bought_power_message: res.__('bought_power_message')
			}
		},
	});
});

module.exports = router;
