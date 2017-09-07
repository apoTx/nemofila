let express = require('express');
let client = require('../redis/client.js');
const uuid = require('uuid');
let multer  = require('multer')
let upload = multer({ dest: 'public/uploads/' })

let router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render( 'newAd', { title: 'New Ad', user: req.session.user });
});

router.post('/uploadPhotos', upload.any(), (req,res) => {
	console.log(req.files);
	res.end('ok');
});

router.post('/saveAdBuffer', (req,res) => {
	let data = req.body.data;
	console.log(data);

	client.hset('newAd', uuid.v1() , JSON.stringify(data), (error) => {
		if (error)
			res.send('Error: ' + error);
		else
			res.json({ status: '1' });
	});
});

router.get('/getAdBuffer', (req,res) => {
	client.hget('newAd', '2',  (err, reply) => {
		res.end(reply);
	});
});

module.exports = router;
