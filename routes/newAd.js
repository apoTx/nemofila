let express = require('express');
let client = require('../redis/client.js');
let fs = require('fs');

// uuid
let uuid = require('uuid');
let _uuid = uuid.v1();

// Multer
let multer  = require('multer');
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = 'public/uploads/'+ _uuid;
		fs.mkdir(dir, err => cb(err, dir));
	},
	filename: function (req, file, cb) {
		let extArray = file.mimetype.split('/');
		let extension = extArray[extArray.length - 1];
		console.log(file);
		cb(null, file.originalname + '-' + Date.now()+ '.' +extension);
	}
});
let upload = multer({ storage: storage });

// Express router
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

	client.hset('newAd', _uuid , JSON.stringify(data), (error) => {
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
