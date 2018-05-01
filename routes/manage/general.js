const express = require('express');
const router = express.Router();

const requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/general', { title: 'General' });
});


module.exports = router;
