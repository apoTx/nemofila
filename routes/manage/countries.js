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

router.delete('/deleteCountry', requireLogin, (req, res) => {
	console.log(req.body);
	Countries.findByIdAndRemove(req.body._id, (err, data) => {
		if (err)
			console.log(err);
		else
			res.json({ 'status': 1 });
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
	console.log(req.body);

	Countries.findByIdAndUpdate( req.body.countryId,
		{
			$push: { 'cities': { 'name': capitalize.words(req.body.name) } }
		},
		{
			safe: true,
			upsert: true
		},
		(err, data) => {
			res.json({ 'status': 1, '_id': data._id, 'name': data.name });
		}
	);
});

module.exports = router;
