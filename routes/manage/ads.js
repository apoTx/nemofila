let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads')

let requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/ads', { title: 'Ads' });
});

router.get('/getAllAds', requireLogin, (req, res) => {
	Ads.find({}, (err, data) => {
		res.json(data);
	});
});

module.exports = router;
