const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');
const passportTwitter = require('../auth/twitter');
const passportGoogle = require('../auth/google');

/* FACEBOOK ROUTER */
router.get('/facebook',
	passportFacebook.authenticate('facebook',  { scope: ['email'] }));

router.get('/facebook/callback',
	passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
	(req, res) => {
		// Successful authentication, redirect home.

		res.redirect('/');
	});

/* TWITTER ROUTER */
router.get('/twitter',
	passportTwitter.authenticate('twitter'));

router.get('/twitter/callback',
	passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

/* GOOGLE ROUTER */
router.get('/google',
	passportGoogle.authenticate('google', { scope: ['profile','email'] } ));

router.get('/google/callback',
	passportGoogle.authenticate('google', { failureRedirect: '/login' }),
	(req, res) => {
		res.redirect('/');
	});


module.exports = router;
