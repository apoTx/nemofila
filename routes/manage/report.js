let express = require('express');
let router = express.Router();

let requireLogin = require('./inc/requireLogin');

/* GET report page. */
router.get('/', requireLogin, (req, res) => {
	res.render('manage/report', { title: 'Report' });
});

module.exports = router;
