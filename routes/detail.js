let express = require('express');
let router = express.Router();
let moment = require('moment');

// Models
let Ads = require('../models/ads');

router.get('/:slug/:id', (req, res, next) => {
	Ads.findById(req.params.id, (err, data) => {
		if (err)
			return next(err);

		res.render( 'detail', { title: data.title, data: data, moment: moment });
	});
});

module.exports = router;
