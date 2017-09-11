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

router.post('/uploadPhotos/:showcaseIndex', (req,res) => {
	const _uuid = uuid.v1();
	const photos = [];
	let showcaseIndex = req.params.showcaseIndex;

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
			console.log(file);
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			let filename = file.originalname + '-' + Date.now()+ '.' +extension;

			if (file.fieldname === 'file['+ showcaseIndex +']' )
				photos.push({ filename: filename, showcase: true });
			else
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

router.post('/saveAdRedis', (req,res) => {
	let data = req.body.data;
	let _uuid = req.body.uuid || uuid.v1();

	// redis save
	client.hmset(_uuid, {
		title: data.title,
		description: data.description,
		price: data.price,
		country: data.country,
		city: data.city,
		district: data.district,
		category: data.category,
		childCategory: data.categoryChild,
		anotherContact: JSON.stringify(data.anotherContact) || false,
		photos: JSON.stringify(req.body.photos) || false
	}, (err) => {
		if(err)
			throw err;
		else
			res.json({ status: 1 });
	});

});

router.get('/getAdBuffer', (req,res) => {
	client.hgetall('43350cf0-965b-11e7-a76e-4d93e04ad2b8',  (err, reply) => {
		console.log(reply);
		res.json(reply);
	});
});

module.exports = router;
