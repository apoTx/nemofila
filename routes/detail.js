let express = require('express');
let router = express.Router();
let moment = require('moment');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

// Models
let Ads = require('../models/ads');
let Favourites = require('../models/favourites');

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
		{ $limit: 1 },
		{
			'$project': {
				'title': 1,
				'description': 1,
				'price': 1,
				'anotherContact': 1,
				'uuid': 1,
				'ownerId': 1,
				'status': 1,
				'photoShowcaseIndex': 1,
				'photos': 1,
				'location': 1,
				'user.name': 1,
				'user._id': 1,
				'user.surname': 1,
				'user.phone': 1
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);

		console.log(result);

		if(result.length < 1){
			res.status(404).render('error/404', { message: 'Ad Not Found' });
		}else{

			let data = result[0];
			let object = {
				title: data.title,
				data: data,
				moment: moment,
				url: req.protocol + '://' + req.get('host') + req.originalUrl,
				session: req.session.user
			};

			console.log(object.session);

			if( data.status === false ){
				if ( req.session.user ){
					if (String(data.ownerId) == req.session.user._id || req.session.user.isAdmin)
						res.render( 'detail', object);
				}else{
					res.status(404).render('error/404', { message: 'Ad Not Found' });
				}
			}else {
				res.render( 'detail', object);
			}
		}
	});
});

router.get('/addFavourites', (req, res) => {
	console.log(req.query);

	let fav = new Favourites({
		userId: req.query.userId,
		adId: req.query.adId,
	});

	fav.save((err) => {
		if (err)
			res.send(err);
		else
			res.json({ status: 1 });
	});

});

module.exports = router;
