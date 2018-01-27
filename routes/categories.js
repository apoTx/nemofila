let express = require('express');
let router = express.Router();

let Categories = require('../models/categories');

router.get('/getCategories', (req,res) => {
	Categories.find({ type: { $exists : false }  }, (err, data) => {
		res.json( data );
	});
});

router.get('/getEventCategories', (req,res) => {
	Categories.find({ type: 1 }, (err, data) => {
		res.json( data );
	});
});

module.exports = router;
