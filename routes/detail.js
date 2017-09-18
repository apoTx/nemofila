let express = require('express');
let router = express.Router();

// Models
let Ads = require('../models/ads');

router.get('/:slug/:id', (req, res, next) => {
	Ads.findById(req.params.id, (err, data) => {
		if (err){
			return next(err);
		}else{
			res.render( 'detail', { title: data.title, data: data });
		}
	});
});

module.exports = router;
