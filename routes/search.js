let express = require('express');
let router = express.Router();

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

/* GET home page. */
router.get( '/', ( req, res ) => {
	res.render('search');
});

module.exports = router;
