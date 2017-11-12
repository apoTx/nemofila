let express = require('express');
let router = express.Router();

// helpers
let mailer = require('../helper/mailer');

router.get( '/', ( req, res) => {
	res.render('contact', { title: res.__('contact_page_title') });
});

router.post( '/', ( req, res) => {
	res.json({'r':'2'});
});

module.exports = router;
