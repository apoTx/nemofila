let express = require('express');
let client = require('../redis/client.js');
let fs = require('fs');

// Models
let Ads = require('../models/ads');

// uuid
let uuid = require('uuid');

// Multer
let multer  = require('multer');

// Express router
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render( 'newAd', { title: 'New Ad', user: req.session.user, redisId: req.cookies.newAdRedisId || false });
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
		title: data.title || '',
		description: data.description || '',
		price: data.price || '',
		country: data.country || '',
		city: data.city || '',
		district: data.district || '',
		category: data.category || '',
		childCategory: data.categoryChild || '',
		anotherContact: JSON.stringify(data.anotherContact) || '',
		photos: JSON.stringify(req.body.photos) || ''
	}, (err) => {
		if(err){
			throw err;
		}else {
			// res.cookie('newAdRedisId', _uuid, { expires: new Date(Date.now() + 1200000), httpOnly: true }); // 20 min expires
			res.json( { status: 1 } );
		}
	});

});

router.post('/create', (req, res) => {
	let data = req.body.data;
	let photos = req.body.photos;
	let uuid = req.body.uuid;

	let ad = new Ads({
		title: data.title,
		price: data.price,
		description: data.description,
		photos: photos,
		uuid: uuid,
		location: {
			countryId: data.country,
			cityId: data.city,
			districtId: data.district,
		},
		category: {
			categoryId: data.category,
			categoryChildId: data.categoryChild
		},
		anotherContact: {
			name: data.anotherContact.name,
			phone: data.anotherContact.phone
		},
	});

	ad.save((err) => {
		if (err)
			res.send(err);
		else
			res.send({ 'status': 1 });
	});
});

router.get('/getAdBuffer/:uuid', (req,res) => {
	let uuid = req.params.uuid;
	client.hgetall(uuid,  (err, reply) => {
		res.json(reply);
	});
});

module.exports = router;
