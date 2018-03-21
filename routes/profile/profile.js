const express = require('express');
const router = express.Router();

// config
const config = require('../../config/env.json')[process.env.NODE_ENV || 'development'];
const requireLogin = require('../inc/requireLogin.js');

// Models
const Users = require('../../models/users');

/* GET users listing. */
router.get('/', requireLogin, (req, res) => {
	res.render( 'profile', {
		title: res.__('profile_title'),
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

router.get('/edit', requireLogin, (req, res) => {
	const userId = req.session.user._id;

	Users.findById(userId, (err, data) => {
		console.log(data);
		res.render('profileEdit', {
			title: res.__('profile_edit_title'),
			user: data,
		});
	});
});

module.exports = router;
