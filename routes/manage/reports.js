const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
const Reports = require('../../models/reports');

// helpers
const requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/reports/reports', { title: 'Reports' });
});

router.get('/detail/:id', requireLogin, (req, res) => {
	Reports.aggregate([
		{
			'$match': {
				'_id': mongoose.Types.ObjectId(req.params.id),
			}
		},
		// ads collection
		{
			$lookup: {
				from: 'ads',
				localField: 'adId',
				foreignField: '_id',
				as: 'ad'
			}
		},
		{
			$unwind: {
				path: '$ad',
				preserveNullAndEmptyArrays: true
			}
		},

		{
			$group: {
				_id: {
					_id: '$_id',
					message: '$message',
					createdAt: '$createdAt',
					ad: '$ad'
				},
			}
		},

		{
			'$project': {
				'_id': '$_id._id',
				'message': '$_id.message',
				'createdAt': '$_id.createdAt',
				'ad': '$_id.ad'
			},
		},
	], (err, data) => {
		if (err)
			throw new Error(err);

		res.render('manage/reports/detail', data[0]);
	});
});

router.get('/getAllReports', requireLogin, (req, res) => {
	Reports.find({ }, (err, data) => {
		res.json(data);
	}).sort({ '_id': -1 });
});

module.exports = router;
