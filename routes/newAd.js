let express = require('express');
let client = require('../redis/client.js');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render( 'newAd', { title: 'New Ad' });
});


/*
* client.set('name3', 'mehmet seven');

	client.get('name3', (err, value) => {
		if (err){
			throw err;
		}

		console.log('the value is: '+ value);
	});
*
* */

router.post('/saveAdBuffer', (req,res) => {

});

module.exports = router;
