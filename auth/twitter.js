let passport = require('passport')
	, TwitterStrategy = require('passport-twitter').Strategy;
let User = require('../models/users');

let mongoose = require('mongoose');

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;


passport.serializeUser((user, fn) => {
	fn(null, user);
});

passport.deserializeUser((id, fn) => {
	User.findOne({
		_id: id.doc._id
	}, (err, user) => {
		fn(err, user);
	});
});

passport.use(new TwitterStrategy({
	consumerKey: config.twitter.api_key,
	consumerSecret: config.twitter.api_secret,
	callbackURL: config.twitter.callbackUrl
},
	((accessToken, refreshToken, profile, done) => {
		console.log(profile)
		User.findOrCreate({
			'social.id': profile.id
		}, {
			name: profile.displayName,
			email: profile.id,
			'social.id': profile.id,
			'social.link': profile.profileUrl,
			'social.provider': 'Twitter',
		}, (err, user) => {
			if (err) {
				console.log(err);
				return done(err);
			}
			done(null, user);
		});
	})
));

module.exports = passport;
