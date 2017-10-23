let express = require('express');
let router = express.Router();

let Favourites = require('../../models/favourites');

let requireLogin = require('../inc/requireLogin.js');

router.get('/getMyFavourites', requireLogin, (req, res) => {
	let _id = req.session.user._id;

	Favourites.aggregate([
		{
			$lookup: {
				from: 'ads',
				localField: 'adId',
				foreignField: '_id',
				as: 'ad'
			}
		},
		{ '$unwind': '$ad' },
		{
			'$match': {
				'userId': _id,
			}
		},
		{
			'$project': {
				'ad.title': 1,
				'ad.price': 1,
				'ad.slug': 1,
				'ad._id': 1,
				'ad.uuid': 1,
				'ad.photos': 1,
				'ad.photoShowcaseIndex': 1,
			},
		},
	], (err, result, next)=> {
		if (err)
			return next( err );

		res.json(result);
	});
});

module.exports = router;
