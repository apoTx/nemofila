let passport = require('passport')
	, FacebookStrategy = require('passport-facebook').Strategy;
let User = require('../models/users');

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;

passport.use(new FacebookStrategy({
	clientID: config.facebook.app_id,
	clientSecret: config.facebook.app_secret,
	callbackURL: config.facebook.callbackUrl,
	profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'link']
},
	((accessToken, refreshToken, profile, done) => {
		console.log(profile._json.email);
		User.findOrCreate({
			'social.id': profile.id
		}, {
			name: profile._json.first_name,
			email: profile._json.email ? profile._json.email : profile.id,
			surname: profile._json.last_name,
			verify: true,
			'social.id': profile.id,
			'social.link': profile.profileUrl,
			'social.provider': 'Facebook',
		}, (err, user) => {
			if (err) { return done(err); }
			done(null, user);
		});
	})
));

module.exports = passport;
