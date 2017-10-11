let express = require('express');
let bcrypt = require('bcryptjs');

let router = express.Router();

// Models
let User = require('../models/users');
let Ads = require('../models/ads');
let forgotPasswords = require('../models/forgotPassword');

// Mail transporter
let mailer = require('../helper/mailer');


/* GET home page. */
router.get( '/reset_password/:uuid', ( req, res ) => {
	res.render('account/reset_password', { title:'Easy Ads' });
});



module.exports = router;
