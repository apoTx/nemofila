let express = require('express');
let router = express.Router();

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/getMyAds', requireLogin, (req, res) => {
	res.json({ 'ok':1 });
});

module.exports = router;
