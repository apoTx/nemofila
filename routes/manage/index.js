let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');

let User = require('./../../models/users');
let Ad = require('./../../models/ads');
let requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
	Ad.aggregate([
		{
			$group: {
				_id: '$statusText',
				total: { $sum: 1 },
			}

		},
		{
			$project: {
				total: 1
			}
		}], (err,data) => {

		User.count().then((count) => {
			res.render('manage/index', { title: 'Dashboard', ads: data, userCount: count });
		});
	});
});

router.get('/login',(req,res) => {
	res.render('manage/login');
});

router.post('/login', (req,res) => {

	User.findOne({ email: req.body.email, isAdmin: true },(err,user) => {
		// Yemi şifre üretmek için

		/*
      const saltRounds = 10;
      const myPlaintextPassword = '123';

      bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
          console.log(hash);
      });
    */

		if(!user){
			res.render('manage/login',{ error: 'Email or password is invalid' });
		}else{
			bcrypt.compare(req.body.password, user.password, (err, r) => {
				if (r) {
					req.session.user = user;
					res.redirect('./');
				}else{
					res.render('manage/login',{ error: 'Email or password is invalid' });
				}
			});
		}
	});
});

router.get('/logout', requireLogin, (req,res) => {
	req.session.reset();
	res.redirect('./');
});

module.exports = router;
