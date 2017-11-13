let express = require('express');
let router = express.Router();

router.get( '/', ( req, res) => {
	res.render('services', { title: res.__('services_page_title') });
});

module.exports = router;
