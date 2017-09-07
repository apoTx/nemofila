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
	let data = { name: 'ahmet', surname:'durueu' };

	client.hset('newAd', '3', JSON.stringify(data), (error) => {
		if (error)
			res.send('Error: ' + error);
		else
			res.end('Movie details saved!');
	});
});

router.get('/getAdBuffer', (req,res) => {
	client.hget('newAd', '2',  (err, reply) => {
		res.end(reply);
	});
});

module.exports = router;
