let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render( 'profile', { title: 'Profile' });
});

module.exports = router;
