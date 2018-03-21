let passport = require('passport')
	, TwitterStrategy = require('passport-twitter').Strategy;
let User = require('../models/users');

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
	callbackURL: config.twitter.callbackUrl,
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
			profilePictureType: 'social',
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
