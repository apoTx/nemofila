let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');

let User = require('./../../models/users');
let Yayin = require('./../../models/manage/yayin');
let requireLogin = require('./inc/requireLogin.js');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
  Yayin.find().sort('-zaman.eklenmeZamanı').find((ex, yayinlar) => {
    res.render('manage/index', { title: 'Dashboard', maclar: yayinlar });
  });
});

router.get('/login',(req,res) => {
  res.render('manage/login');
});

router.post('/login', (req,res) => {

  User.findOne({ email: req.body.email },(err,user) => {

    // Yemi şifre üretmek için

    /*
      const saltRounds = 10;
      const myPlaintextPassword = 'MnoguTeskaLozinka123';

      bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
          console.log(hash);
      });
    */

    if(!user){
      res.render('manage/login',{ error: 'email yada şifre geçersiz' });
    }else{
      bcrypt.compare(req.body.password, user.pw, (err, r, next) => {
        if (r) {
          req.session.user = user;
          res.redirect('./');
        }else{
          res.render('manage/login',{ error: '** Email yada şifre geçersiz.' });
          next();
        }
      });
    }
  });
});


router.get('/dashboard', requireLogin, (req, res) => {
  res.render('manage/index');
});


router.get('/logout', requireLogin, (req,res) => {
  req.session.reset();
  res.redirect('./');
});

module.exports = router;