let express = require('express');
let router = express.Router();
let capitalize = require('capitalize');
let requireLogin = require('./inc/requireLogin');

let Categories = require('../../models/categories');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/event-categories', { title: 'Event Categories' });
});

router.get('/getEventCategories', requireLogin, (req,res) => {
	Categories.find({ type: 1 }, (err, data) => {
		res.json( data );
	});
});

router.post('/saveEventCategory', requireLogin, (req, res) => {
	let category = new Categories({
		name: capitalize.words(req.body.name),
		type: 1
	});

	category.save((err, data) => {
		if (err)
			throw new Error(err);

		res.json({ 'status': 1, '_id': data._id, 'name': data.name });
	});
});

router.post('/saveSubCategory', requireLogin, (req, res) => {
	Categories.findByIdAndUpdate( req.body.countryId,
		{
			$push: { 'subCategories': { 'name': capitalize.words(req.body.name) } }
		},
		{
			safe: true,
			upsert: true,
			new: true
		},
		(err, data) => {
			let d = data.subCategories[data.subCategories.length - 1];
			res.json({ 'status': 1, '_id': d._id, 'name': d.name });
		}
	);
});

router.delete('/deleteEventCategory', requireLogin, (req, res) => {
	Categories.findByIdAndRemove(req.body._id, (err) => {
		if (err)
			throw(err);
		res.json({ 'status': 1 });
	});
});

router.delete('/deleteSubCategory', requireLogin, (req, res) => {
	Categories.update(
		{
			_id: req.body.categoryId
		},
		{
			'$pull': {
				'subCategories':
					{
						'_id': req.body._id
					}
			}
		},
		{
			safe: true,
			multi:true
		},
		(err) => {
			if (err)
				throw(err);
			res.json({ 'status': 1 });
		});
});

module.exports = router;
