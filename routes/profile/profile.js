let express = require('express');
let router = express.Router();

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/', requireLogin, (req, res) => {
	res.render( 'profile', { title: 'Profile' });
});


module.exports = router;
