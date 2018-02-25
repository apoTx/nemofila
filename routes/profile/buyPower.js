let express = require('express');
let router = express.Router();

// Models
let Power = require('../../models/powers');

let requireLogin = require('../inc/requireLogin.js');

router.post('/savePower', requireLogin, (req, res) => {
	let adId = req.body.adId;
	let powerNumber = req.body.powerNumber;

	let power = new Power ({
		adId: adId,
		powerNumber: powerNumber,
		price: powerNumber * 10,
	});

	power.save((err) => {
		if (err)
			throw new Error( err );

		res.json({ 'status': 1 });
	});
});

module.exports = router;
