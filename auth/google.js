let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let User = require('../models/users');

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;

passport.use(new GoogleStrategy({
	clientID: config.google.app_id,
	clientSecret: config.google.app_secret,
	callbackURL: config.google.callbackUrl
},
	((accessToken, refreshToken, profile, done) => {
		User.findOrCreate({
			_id: profile.id
		}, {
			name: profile.displayName,
			_id: profile.id
		}, (err, user) => {
			return done(err, user);
		});
	})
));

module.exports = passport;
