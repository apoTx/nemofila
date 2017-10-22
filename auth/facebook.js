let passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;
let User = require('../models/users');

let mongoose = require('mongoose');

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;

passport.use(new FacebookStrategy({
	clientID: config.facebook.app_id,
	clientSecret: config.facebook.app_secret,
	callbackURL: config.facebook.callbackUrl
},
	((accessToken, refreshToken, profile, done) => {
		User.findOrCreate({
			name: profile.displayName
		}, {
			name: profile.displayName,
			userid: profile.id
		}, (err, user) => {
			if (err) { return done(err); }
			done(null, user);
		});
	})
));

module.exports = passport;
