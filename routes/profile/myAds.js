let express = require('express');
let router = express.Router();

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/getAds', requireLogin, (req, res) => {
	res.send(req.session);
});

module.exports = router;
