const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// helpers
const User = require('../models/users');

// config
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;

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
			surname: data.name.familyName,
			email: data.emails[0].value,
			verify: true,
			profilePictureUrl: data.image.url + '0',
			'social.id': data.id,
			'social.link': data.url,
			'social.provider': 'Google',
		}, (err, user) => {
			return done(err, user);
		});
	})
));

module.exports = passport;
