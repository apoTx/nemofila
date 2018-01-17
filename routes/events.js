let express = require('express');
let router = express.Router();

router.get( '/', ( req, res) => {
	res.send('events');
});

router.get( '/new/:adId', ( req, res) => {
	res.render('new-event', { title: res.__('new-event-page-title') });
});

module.exports = router;
