let express = require('express');
let client = require('../redis/client.js');
//let fs = require('fs');

// uuid
let uuid = require('uuid');

// Multer
let multer  = require('multer');

// Express router
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render( 'newAd', { title: 'New Ad', user: req.session.user });
});

router.post('/uploadPhotos',  (req,res) => {
	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			const dir = 'public/uploads/';

			cb(null, dir);

			/*
			if (!fs.existsSync(dir)){
				fs.mkdir(dir, err => cb(err, dir));
			}else{
				cb(null, dir);
			}*/
		},
		filename: function (req, file, cb) {
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			console.log(file);
			cb(null, file.originalname + '-' + Date.now()+ '.' +extension);
		}
	});

	let upload = multer({ storage: storage }).any();

	upload(req,res, (err) => {
		if (err)
			throw err;
		else
			res.json({ status: 1 });
	});
});

router.post('/saveAdBuffer', (req,res) => {
	let data = req.body.data;
	console.log(data);

	client.hset('newAd', uuid.v1() , JSON.stringify(data), (error) => {
		if (error)
			res.send('Error: ' + error);
		else
			res.json({ status: 1 });
	});
});

router.get('/getAdBuffer', (req,res) => {
	client.hget('newAd', '2',  (err, reply) => {
		res.end(reply);
	});
});

module.exports = router;
