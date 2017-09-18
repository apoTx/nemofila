let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	console.log(req.params);
	res.render( 'detail', { title: 'Detail' });
});

module.exports = router;
