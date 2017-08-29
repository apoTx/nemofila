let express = require('express');
let router = express.Router();

// Models
let User = require('../models/users');

/* GET home page. */
router.get( '/', ( req, res ) => {
  res.render('index', { title:'Easy Ads' });
});

router.post( '/saveUser', ( req, res ) => {
  let data = req.body.data;

  let user = new User({
    'name': data.name,
    'surname': data.surname,
    'email': data.email,
    'phone': data.phone,
    'password': data.password
  });

  user.save((err) => {
    if (err)
      res.send(err);
    else
      res.send('ok');
  });
});

module.exports = router;
