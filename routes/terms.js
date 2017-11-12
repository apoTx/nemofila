let express = require('express');
let router = express.Router();

router.get( '/', ( req, res) => {
	res.render('terms', { title: res.__('terms_page_title') });
});

module.exports = router;
