let express = require('express');
let path = require('path');
//var favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let sessions = require('client-sessions');
let passport = require('passport');
let i18n = require('i18n');


// Development env file
let config = require('./config/env.json')[process.env.NODE_ENV || 'development'];

//Routes
let index = require('./routes/index');
let newAd = require('./routes/newAd');
let detail = require('./routes/detail');
let profile = require('./routes/profile/profile');
let account = require('./routes/account');
let myAds = require('./routes/profile/myAds');
let buyPower = require('./routes/profile/buyPower');
let myFavourites = require('./routes/profile/myFavourites');
let myMessages = require('./routes/profile/myMessages');
let countries = require('./routes/countries');
let categories = require('./routes/categories');
let auth = require('./routes/auth');


// Admin Routes
let manage = require('./routes/manage/index');
let ads = require('./routes/manage/ads');
let users = require('./routes/manage/users');
let manage_countries = require('./routes/manage/countries');
let manage_categories = require('./routes/manage/categories');

// Models
let User = require('./models/users');

// Mongo connection
let mongoose = require('mongoose');
mongoose.connect(config.db.MONGO_URI, {
	useMongoClient: true,
});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

i18n.configure({
	locales:['en', 'es', 'tr'],
	directory: __dirname + '/locales',
	defaultLocale: 'en',
	cookie: 'locale'
});

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('i18n_localization'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(sessions({
	secret: 'i18n_localization',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));

app.use(i18n.init);

// Login sessions
app.use(sessions({
	cookieName: 'session',
	secret: 'asdasjdh19e1djdalsdjasdljDJALSJDLASJDLJSAdkljaslkdj',
	maxAge: 14 * 24 * 3600000, // 2 weeks
}));
app.use(passport.initialize());

// User auth
app.use((req,res,next) => {
	if(req.session && (req.session.user || req.session.passport)){
		let findObj;
		if (req.session.user){
			findObj = { email: req.session.user.email };
		}else{
			findObj = { _id:  req.session.passport.user.doc._id };
		}
		User.findOne(findObj,(err,user) => {
			if(user){
				req.user = user;
				delete req.user.password;
				req.session.user = req.user;
				res.locals.user = req.user;
			}
			next();
		}).select({ name: 1, surname:1, _id: 1, isAdmin: true, email: 1 });
	}else{
		next();
	}
});

app.use('/manage/', manage);
app.use('/manage/ads', ads);
app.use('/manage/users', users);
app.use('/manage/countries', manage_countries);
app.use('/manage/categories', manage_categories);
app.use('/', index);
app.use('/auth', auth);
app.use('/newAd', newAd);
app.use('/detail', detail);
app.use('/profile', profile);
app.use('/profile/adsMy', myAds);
app.use('/profile/buyPower', buyPower);
app.use('/profile/myFavourites', myFavourites);
app.use('/profile/myMessages', myMessages);
app.use('/account', account);
app.use('/countries', countries);
app.use('/categories', categories);


// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
