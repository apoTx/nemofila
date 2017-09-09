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
	const _uuid = uuid.v1();
	const photos = [];

	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			const dir = 'public/uploads/'+ _uuid;

			if (!fs.existsSync(dir)){
				fs.mkdir(dir, err => cb(err, dir));
			}else{
				cb(null, dir);
			}
		},
		filename: function (req, file, cb) {
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			let filename = file.originalname + '-' + Date.now()+ '.' +extension;
			photos.push({ filename: filename });
			cb(null, filename);
		}
	});

	let upload = multer({ storage: storage }).any();

	upload(req,res, (err) => {
		if (err){
			throw err;
		}else {
			res.json({ status: 1, uuid: _uuid, photos: photos });
		}
	});
});

router.post('/saveAdBuffer', (req,res) => {
	let data = req.body.data;
	
	// redis save
	client.hmset(req.body.uuid, {
		title: data.title,
		description: data.description,
		price: data.price,
		country: data.country,
		city: data.city,
		district: data.district,
		category: data.category,
		childCategory: data.categoryChild,
		anotherContact: data.anotherContact.checked ? JSON.stringify(data.anotherContact) : false,
		photos: JSON.stringify(req.body.photos)
	}, (err) => {
		if(err)
			throw err;
		else
			res.json({ status: 1 });
	});

});

router.get('/getAdBuffer', (req,res) => {
	client.hgetall('ef8195f0-9557-11e7-9cbf-435411554d7c',  (err, reply) => {
		console.log(reply);
		res.json(reply);
	});
});

module.exports = router;
