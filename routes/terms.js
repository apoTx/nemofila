let express = require('express');
let router = express.Router();

router.get( '/', ( req, res) => {
	res.render('terms', { title: 'terms'  });
});

module.exports = router;
