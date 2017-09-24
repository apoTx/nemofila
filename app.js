let express = require('express');
let path = require('path');
//var favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let sessions = require('client-sessions');
let passport = require('passport');

// Development env file
let config = require('./config/env.json')[process.env.NODE_ENV || 'development'];

//Routes
let index = require('./routes/index');
let newAd = require('./routes/newAd');
let detail = require('./routes/detail');
let profile = require('./routes/profile');

// Admin Routes
let manage = require('./routes/manage/index');
let countries = require('./routes/manage/countries');

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Login sessions
app.use(sessions({
	cookieName: 'session',
	secret: 'asdasjdh19e1djdalsdjasdljDJALSJDLASJDLJSAdkljaslkdj',
	maxAge: 14 * 24 * 3600000, // 2 weeks
}));
app.use(passport.initialize());
app.use(passport.session());

// User auth
app.use((req,res,next) => {
	if(req.session && req.session.user){
		User.findOne({ email:req.session.user.email },(err,user) => {
			if(user){
				req.user = user;
				delete req.user.password;
				req.session.user = req.user;
				res.locals.user = req.user;
			}
			next();
		});
	}else{
		next();
	}
});


app.use('/manage/', manage);
app.use('/manage/countries', countries);
app.use('/', index);
app.use('/newAd', newAd);
app.use('/detail', detail);
app.use('/profile', profile);


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
