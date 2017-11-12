let express = require('express');
let router = express.Router();

// helpers
let mailer = require('../helper/mailer');

router.get( '/contact', ( req, res) => {
	res.render('contact', { title: 'contact'  });
});

module.exports = router;
