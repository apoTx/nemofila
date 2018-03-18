const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
// Models
const Reports = require('../../models/reports');

const requireLogin = require('./inc/requireLogin.js');


/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/reports/reports', { title: 'Reports' });
});

router.get('/edit/:id', requireLogin, (req, res) => {
	Reports.aggregate([
		{
			'$match': {
				'_id': mongoose.Types.ObjectId(req.params.id),
			}
		},
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
				},
				power: {
					$push: '$power'
				},
				totalActivePower: {
					$sum: { $cond: [{ $gte: [ '$power.endingAt', new Date() ] }, '$power.powerNumber', 0] }
				},
				totalEndingPower: {
					$sum: { $cond: [{ $lte: [ '$power.endingAt', new Date() ] }, '$power.powerNumber', 0] }
				},
				totalPower: {
					$sum: '$power.powerNumber'
				},
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
				power: 1,
				totalActivePower: 1,
				totalEndingPower: 1,
				totalPower: 1
			},
		},
	], (err, data) => {
		if (err)
			throw new Error(err);

		let result = data[0];
		console.log(result);
		res.render('manage/ads/ad_edit', {
			title: result.title,
			data: result,
			statusText: getAdStatusText(result.status),
			moment: moment
		});
	});

	/*
	Ads.findById( req.params.id ,(err,result) => {
		if (err)
			next();

		console.log(result);
		if (result)
			res.render('manage/ads/ad_edit', {
				title: result.title,
				data: result,
				statusText: getAdStatusText(result.status)
			});
		else
			next();
	});*/
});

router.get('/getAllReports', requireLogin, (req, res, next) => {
	Reports.find({ }, (err, data) => {
		res.json(data);
	}).sort({ '_id': -1 });
});

module.exports = router;
