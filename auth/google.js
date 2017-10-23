let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth20').Strategy;
let User = require('../models/users');

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;

passport.use(new GoogleStrategy({
	clientID: config.google.app_id,
	clientSecret: config.google.app_secret,
	callbackURL: config.google.callbackUrl
},
	((accessToken, refreshToken, profile, done) => {
		let data = profile._json;
		console.log(data);

		User.findOrCreate({
			'social.id': data.id
		}, {
			name: data.name.givenName,
			email: data.name.familyName,
			verify: true,
			'social.id': data.id,
			'social.link': data.url,
			'social.provider': 'Google',
		}, (err, user) => {
			return done(err, user);
		});
	})
));

module.exports = passport;
