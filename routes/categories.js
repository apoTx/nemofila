const express = require('express');
const router = express.Router();

// models
const Categories = require('../models/categories');

router.get('/getCategories', (req,res) => {
	const locale = req.cookies['locale'];

	const converSubCategoryLang = (element) => {
		return {
			name: res.__(element.name),
			_id: element.id
		};
	};
	const convertLang = (element) => {
		return {
			name: res.__(element.name),
			_id: element._id,
			subCategories: (element.subCategories).map(converSubCategoryLang)
		};
	};

	Categories.find({ $or: [ { type: { $exists : false } }, { type: false } ]   }, (err, data) => {
		if (!locale || locale === 'en') {
			res.json(data);
		}else{
			const convertedData = data.map(convertLang);
			res.json(convertedData);
		}
	});
});

router.get('/getEventCategories', (req,res) => {
	Categories.find({ type: 1 }, (err, data) => {
		data.map(category => {
			return res.__(category.name);
		});
		res.json(data);
	});
});

module.exports = router;
