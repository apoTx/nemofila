let express = require('express');
let router = express.Router();

let Countries = require('../models/countries');

router.get('/getCountries', (req,res) => {
	Countries.find({}, (err, data) => {
		res.json( data );
	});
});

module.exports = router;
