let express = require('express');
let router = express.Router();
let moment = require('moment');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

let requireLogin = require('./inc/requireLogin.js');

// Models
let Ads = require('../models/ads');
let Favourites = require('../models/favourites');

let getObject = (data, req) => {

	// For category
	let childCategoryName = (data.categoryObj.subCategories).find(x => String(x._id) === String(data.category.categoryChildId)).name;

	// For location
	let cityObj = (data.locationObj.cities).find(x => String(x._id) === String(data.location.cityId));
	let cityName = cityObj.name;
	let districtName = (cityObj.districts).find(x => String(x._id) === String(data.location.districtId)).name;

	return {
		title: data.title,
		data: data,
		moment: moment,
		url: req.protocol + '://' + req.get('host') + req.originalUrl,
		session: req.session.user,
		category: {
			name: data.categoryObj.name,
			childCategoryName: childCategoryName,
			districtName: districtName
		},
		location: {
			name: data.locationObj.name,
			cityName: cityName,
			districtName: districtName
		}
	};
};

router.get('/:slug/:id', (req, res, next) => {
	let _id;
	try{
		_id = new ObjectId(req.params.id);
	}catch(e){
		_id = '';
	}

	Ads.aggregate([
		{
			'$match': {
				'_id': _id,
			}
		},

		// User collection
		{
			$lookup: {
				from: 'users',
				localField: 'ownerId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },

		// categories collection
		{
			$lookup: {
				from: 'categories',
				localField: 'category.categoryChildId',
				foreignField: 'subCategories._id',
				as: 'categoryObj'
			}
		},
		{ '$unwind': '$categoryObj' },

		// countries collection
		{
			$lookup: {
				from: 'countries',
				localField: 'location.districtId',
				foreignField: 'cities.districts._id',
				as: 'locationObj'
			}
		},
		{ '$unwind': '$locationObj' },

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
				'user.name': 1,
				'user._id': 1,
				'user.surname': 1,
				'user.phone': 1,
				'category': 1,
				'categoryObj': '$categoryObj',
				'location': 1,
				'locationObj': '$locationObj'
			},
		},
	], (err, result)=>{
		if (err)
			return next(err);


		if(result.length < 1){
			res.status(404).render('error/404', { message: 'Ad Not Found' });
		}else{

			let data = result[0];

			console.log(data);

			if( data.status !== 1){
				if ( req.session.user ){
					if (String(data.ownerId) == req.session.user._id || req.session.user.isAdmin)
						res.render( 'detail', getObject(data,req));
					else
						res.status(404).render('error/404', { message: 'Ad Not Found' });
				}else{
					res.status(404).render('error/404', { message: 'Ad Not Found' });
				}
			}else {
				res.render( 'detail', getObject(data,req));
			}
		}
	});
});

router.get('/addFavourites', requireLogin, (req, res) => {
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

router.get('/delFavourites', requireLogin, (req, res) => {
	Favourites.findOneAndRemove({
		userId: req.query.userId,
		adId: req.query.adId
	},(err) => {
		if (err)
			res.send(err);
		else
			res.json({ status: 1 });
	});
});

router.get('/isFav', requireLogin, (req, res) => {
	Favourites.findOne( {
		userId: req.query.userId,
		adId: req.query.adId
	},(err, response) => {
		if (err)
			res.send(err);
		else
			res.json({ isFav: response == null ? false : true });
	});
});

module.exports = router;
