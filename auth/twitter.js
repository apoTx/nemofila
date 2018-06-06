const passport = require('passport')
	, TwitterStrategy = require('passport-twitter').Strategy;

// Models
const User = require('../models/users');

// config
const config = require('../config/env.json')[process.env.NODE_ENV || 'development'].login;

// helpers
const getProfilePicture = require('../helper/getProfilePicture.js');

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
	consumerKey: process.env.TWITTER_API_KEY,
	consumerSecret: process.env.TWITTER_API_SECRET,
	callbackURL: process.env.TWITTER_API_CALLBACK_URL,
	userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
},
	((accessToken, refreshToken, profile, done) => {
		let data = profile._json;
		console.log(data);
		User.findOrCreate({
			'social.id': data.id
		}, {
			name: data.name,
			email: data.email,
			verify: true,
			profilePictureUrl: getProfilePicture('Twitter', false, data.screen_name),
			'social.id': data.id,
			'social.screen_name': data.screen_name,
			'social.link': data.url,
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
