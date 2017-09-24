let express = require('express');
let router = express.Router();
let requireLogin = require('./inc/requireLogin');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/countries', { title: 'Countries' });
});


module.exports = router;
