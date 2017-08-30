let express = require('express');
let bcrypt = require('bcryptjs');

let router = express.Router();

// Models
let User = require('../models/users');

/* GET home page. */
router.get( '/', ( req, res ) => {
  res.render('index', { title:'Easy Ads' });
});

router.post( '/register', ( req, res ) => {
  let data = req.body.data;

  // Password hash
  const saltRounds = 10;
  bcrypt.hash(req.body.data.password, saltRounds).then((hash) => {
	  let user = new User({
		  'name': data.name,
		  'surname': data.surname,
		  'email': data.email,
		  'phone': data.phone,
		  'password': hash
	  });

	  user.save((err) => {
		  if (err)
			  res.send(err);
		  else
			  res.send({ 'status': 1 });
	  });
  });
});

module.exports = router;
