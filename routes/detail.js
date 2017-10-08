let express = require('express');
let router = express.Router();
let moment = require('moment');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

// Models
let Ads = require('../models/ads');

router.get('/:slug/:id', (req, res, next) => {
	let _id;
	try{
		_id = new ObjectId(req.params.id);
	}catch(e){
		_id = '';
	}

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
			'$match': {
				'_id': _id,
			}
		},
		{
			'$project': {
				'title': 1,
				'description': 1,
				'price': 1,
				'anotherContact': 1,
				'uuid': 1,
				'status': 1,
				'photoShowcaseIndex': 1,
				'photos': 1,
				'location': 1,
				'user.name': 1,
				'user.surname': 1,
				'user.phone': 1,
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);

		if(result.length < 1){
			let notFound = new Error('No Ads Found');
			notFound.status = 404;
			return next(notFound);
		}


		console.log(result);

		res.render( 'detail', {
			title: result[0].title,
			data: result[0],
			moment: moment,
			url: req.protocol + '://' + req.get('host') + req.originalUrl
		});
	});

	/*
	Ads.findById(req.params.id, (err, data) => {
		if (err)
			return next(err);

		res.render( 'detail', { title: data.title, data: data, moment: moment });
	});*/
});

module.exports = router;
