const express = require('express');
const router = express.Router();

const Categories = require('../models/categories');

const TJO = require('translate-json-object')();

TJO.init({
	googleApiKey: 'AIzaSyB_lGh1XHqm3h8QkP75avEWwP53G08K8EI',
});

router.get('/getCategories', (req,res) => {
	Categories.find({ $or: [ { type: { $exists : false } }, { type: false } ]   }, (err, data) => {
		const locale = req.cookies['locale'];

		if (!locale){
			res.json(data);
		}else{
			const obj = JSON.parse(JSON.stringify(data));

			TJO.translate(obj, locale)
				.then((data) => {
					console.log(data);
					res.json(data);
				}).catch((err) => {
					console.log('error ', err);
				});
		}
	});
});

router.get('/getEventCategories', (req,res) => {
	Categories.find({ type: 1 }, (err, data) => {
		res.json( data );
	});
});

module.exports = router;
