let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads');

let requireLogin = require('../inc/requireLogin.js');

// Helper
let getAdStatusText = require('../../helper/getAdStatusText');

/* GET users listing. */
router.get('/getMyAds', requireLogin, (req, res) => {
	let _id = req.session.user._id;

	Ads.find({
		'ownerId': _id,
	},{
		'title': 1,
		'slug': 1,
		'uuid': 1,
		'photos': 1,
		'photoShowcaseIndex': 1,
		'price': 1,
		'status': 1,
		'statusText': 1,
	},(err, data)=>{
		if (err)
			console.log(err);

		console.log(data);

		res.json(data);
	});
});

module.exports = router;
