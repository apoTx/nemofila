let express = require('express');
let router = express.Router();

let moment = require('moment');

// Models
let Ads = require('../../models/ads');
let Users = require('../../models/users');

let requireLogin = require('./inc/requireLogin.js');
/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/users', { title: 'Users' });
});

router.get('/getAllUsers', requireLogin, (req, res, next) => {
	Users.aggregate([

		// Ads collection
		{
			$lookup: {
				from: 'ads',
				localField: '_id',
				foreignField: 'ownerId',
				as: 'ad'
			}
		},
		{
			'$unwind': {
				path: '$ad',
				preserveNullAndEmptyArrays: true
			}
		},

		{
			$group: {
				_id: {
					_id: '$_id',
					name: '$name',
					surname: '$surname',
					email: '$email',
				},
				ads: {
					$push: '$ad'
				}
			}
		},

		{
			'$project': {
				'_id': '$_id._id',
				'name': '$_id.name',
				'surname': '$_id.surname',
				'email': '$_id.email',
				'ads': '$ads',
			},
		},
		{ $sort : { createdAt : -1 } },
	], (err, result) => {
		if (err)
			return next(err);

		console.log(result);
		res.json(result);
	});
});

router.get('/advanceSearch', requireLogin, (req, res) => {
	let data = JSON.parse(req.query.data);
	let status = parseInt(data.status);

	if(!data.startDate){
		data.startDate = '2016-01-01'; // for if startDate empty, get all data.
	}

	let startDate = moment(data.startDate).format('YYYY-MM-DD');
	let endDate = moment(data.endDate).add(1, 'days').format('YYYY-MM-DD');


	Ads.aggregate([
		{
			'$match': {
				'status': data.status ? status : { $exists: true },
				'createdAt': { '$gte':   new Date(startDate), '$lte': new Date(endDate) },
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

		// Power collection
		{
			$lookup: {
				from: 'powers',
				localField: '_id',
				foreignField: 'adId',
				as: 'power'
			}
		},
		{
			$unwind: {
				path: '$power',
				// ad collection, power collectionda herhangi eşleşme yapamasa bile ad'i döndür.
				preserveNullAndEmptyArrays: true
			}
		},

		{
			$group: {
				_id: {
					_id: '$_id',
					title: '$title',
					status: '$status',
					statusText: '$statusText',
					slug: '$slug',
					createdAt: '$createdAt',
					user: {
						name: '$user.name',
						surname: '$user.surname'
					}
				},
				power: {
					$push: '$power'
				},
				totalPower: {
					$sum: { $cond: [{ $gte: [ '$power.endingAt', new Date() ] }, '$power.powerNumber', 0] }
				}
			}
		},

		{
			'$project': {
				'_id': '$_id._id',
				'title': '$_id.title',
				'status': '$_id.status',
				'statusText': '$_id.statusText',
				'slug': '$_id.slug',
				'createdAt': '$_id.createdAt',
				'user': '$_id.user',
				totalPower: 1
			},
		},
		{ $sort : { createdAt : -1 } },
	], (err, data) => {
		if (err)
			throw new Error(err);

		console.log(data);
		res.json(data);
	});
});

module.exports = router;
