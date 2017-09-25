let express = require('express');
let router = express.Router();
let capitalize = require('capitalize');
let requireLogin = require('./inc/requireLogin');

let Countries = require('../../models/countries');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/countries', { title: 'Countries' });
});

router.get('/getCountries', requireLogin, (req,res) => {
	Countries.find({}, (err, data) => {
		res.json( data );
	});
});

router.post('/saveCountry', requireLogin, (req, res) => {
	let country = new Countries({
		name: capitalize.words(req.body.name)
	});

	country.save((err, data) => {
		if (err)
			console.log(err);

		res.json({ 'status': 1, '_id': data._id, 'name': data.name });
	});
});

router.post('/saveCity', requireLogin, (req, res) => {
	Countries.findByIdAndUpdate( req.body.countryId,
		{
			$push: { 'cities': { 'name': capitalize.words(req.body.name) } }
		},
		{
			safe: true,
			upsert: true,
			new: true
		},
		(err, data) => {
			let d = data.cities[data.cities.length - 1];
			res.json({ 'status': 1, '_id': d._id, 'name': d.name });
		}
	);
});

router.post('/saveDistrict', requireLogin, (req, res) => {
	Countries.findOneAndUpdate(
		{
			_id:  req.body.countryId,
			'cities._id': req.body.cityId
		},
		{
			$push: { 'cities.$.districts': { 'name': capitalize.words(req.body.name) } }
		},
		{
			safe: true,
			upsert: true,
			new: true
		},
		(err, data) => {
			let districts = data.cities[req.body.cityIndex].districts;
			let district = districts[districts.length - 1];
			res.json({ 'status': 1, '_id': district._id, 'name': district.name });
		}
	);
});

router.delete('/deleteCountry', requireLogin, (req, res) => {
	console.log(req.body);
	Countries.findByIdAndRemove(req.body._id, (err) => {
		if (err)
			throw(err);
		res.json({ 'status': 1 });
	});
});

router.delete('/deleteCity', requireLogin, (req, res) => {
	console.log(req.body);
	Countries.update(
		{
			_id: req.body.countryId
		},
		{
			'$pull': {
				'cities':
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

router.delete('/deleteDistrict', requireLogin, (req, res) => {
	console.log(req.body);
	Countries.update(
		{
			_id: req.body.countryId,
			'cities._id': req.body.cityId
		},
		{
			'$pull': {
				'cities.$.districts':
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
