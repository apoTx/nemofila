let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads')

let requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/ads', { title: 'Ads' });
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
		{
			'$project': {
				'title': 1,
				'status': 1,
				'createdAt': 1,
				'user.name': 1,
				'user.surname': 1,
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);

		console.log(result);
		res.json(result);
	});
});

module.exports = router;
