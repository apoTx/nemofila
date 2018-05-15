let express = require('express');
let router = express.Router();

router.get( '/', ( req, res) => {
	res.render('privacy-policy', { title: res.__('privacy-policy_title') });
});

module.exports = router;
