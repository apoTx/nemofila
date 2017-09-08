let express = require('express');
let client = require('../redis/client.js');
let fs = require('fs');

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

router.post('/uploadPhotos', (req,res) => {

	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			const dir = 'public/uploads/';

			if (!fs.existsSync(dir)){
				fs.mkdir(dir, err => cb(err, dir));
			}else{
				cb(null, dir);
			}
		},
		filename: function (req, file, cb) {
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			console.log('test');
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
	let _uuid = uuid.v1();

	console.log(data);
	// redis save
	client.hmset(_uuid , { title:data.title }, (err) => {
		if(err)
			throw err;
		else
			res.json({ status: 1 });
	});

});

router.get('/getAdBuffer', (req,res) => {
	client.hgetall('myhashkey',  (err, reply) => {
		console.log(reply);
		res.json(reply);
	});
});

module.exports = router;
