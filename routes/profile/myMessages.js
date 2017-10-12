let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads');

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/createConversation', requireLogin, (req, res) => {
	console.log('ok');
});

module.exports = router;
