let express = require('express');
let router = express.Router();

// Models
let Ads = require('../../models/ads');

let requireLogin = require('../inc/requireLogin.js');
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

		res.json(data);
	}).sort({ createdAt: -1 });
});

router.post('/unpublish', requireLogin, (req, res) => {
	let id = req.body.id;

	Ads.findByIdAndUpdate(id, {
		status: 4,
		statusText: getAdStatusText(4)
	}, (err) => {
		if (!err)
			res.json({ status: 1 });
	});
});

module.exports = router;
