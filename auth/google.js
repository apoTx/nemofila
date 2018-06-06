const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// helpers
const User = require('../models/users');

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_APP_ID,
	clientSecret: process.env.GOOGLE_APP_SECRET,
	callbackURL: process.env.GOOGLE_APP_CALLBACK_URL
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
