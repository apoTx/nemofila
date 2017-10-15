let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads');

let requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/ads/ads', { title: 'Ads' });
});

router.get('/edit/:id', requireLogin, (req, res) => {
	Ads.findById( req.params.id ,(err,result) => {
		res.render('manage/ads/ad_edit', { title: 'Ad Edit', data: result });
	});
});

router.get('/getAllAds', requireLogin, (req, res, next) => {
	Ads.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'ownerId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },
		{ $sort : { _id : -1 } },
		{
			'$project': {
				'_id': 1,
				'title': 1,
				'status': 1,
				'slug': 1,
				'createdAt': 1,
				'user.name': 1,
				'user.surname': 1,
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);

		res.json(result);
	});
});

module.exports = router;
