let express = require('express');
let router = express.Router();

let Categories = require('../models/categories');

router.get('/getCategories', (req,res) => {
	Categories.find({}, (err, data) => {
		res.json( data );
	});
});

module.exports = router;
