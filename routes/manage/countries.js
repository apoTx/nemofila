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
	res.json({'STA':1});
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

module.exports = router;
