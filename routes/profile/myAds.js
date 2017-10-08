let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads');

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/getMyAds', requireLogin, (req, res) => {
	let _id = req.session.user._id;

	Ads.find({
		'ownerId': _id
	},{
		'title': true,
		'slug': true,
	},(err, data)=>{
		if (err)
			console.log(err);

		res.json(data);
	});
});

module.exports = router;
