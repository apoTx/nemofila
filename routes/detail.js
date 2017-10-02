let express = require('express');
let router = express.Router();
let moment = require('moment');
let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Models
let Ads = require('../models/ads');

router.get('/:slug/:id', (req, res, next) => {

	Ads.aggregate([{
		$lookup: {
			from: 'users',
			localField: 'ownerId',
			foreignField: '_id',
			as: 'user'
		}
	},
	{ '$unwind': '$user' },
	{ '$match': { '_id': ObjectId(req.params.id)  } },
	{
		'$project': {
			'title': 1,
			'description': 1,
			'price': 1,
			'anotherContact': 1,
			'uuid': 1,
			'photoShowcaseIndex': 1,
			'photos': 1,
			'user.name': 1,
			'user.surname': 1,
			'user.phone': 1
		}
	},
	], (err, result)=>{
		if (err)
			return next(err);

		console.log(result);
		res.render( 'detail', { title: result[0].title, data: result[0], moment: moment });
	});

	/*
	Ads.findById(req.params.id, (err, data) => {
		if (err)
			return next(err);

		res.render( 'detail', { title: data.title, data: data, moment: moment });
	});*/
});

module.exports = router;
