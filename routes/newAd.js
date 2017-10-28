let express = require('express');
let client = require('../redis/client.js');
let fs = require('fs');
let slugify = require('slugify');
let request = require('request');


// Models
let Ads = require('../models/ads');

// uuid
let uuid = require('uuid');

// Multer
let multer  = require('multer');

// Express router
let router = express.Router();

let AwsS3Form = require( 'aws-s3-form' );

let formGen = new AwsS3Form({
	accessKeyId:		'AKIAJ5QBSCQVZWV3GTSA',
	secretAccessKey:	'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',
	region:				'eu-central-1',
	bucket:				'mehmet-easyad-test',
	redirectUrlTemplate:'http://localhost:3000/redir/<%= filename %>'
});

/* GET users listing. */
router.get('/', (req, res) => {

	request('http://localhost/amazon-service.php', (error, response, body) => {
		res.render( 'newAd', {
			title: 'New Ad',
			userExists: req.session.user ? true : false,
			redisId: req.cookies.newAdRedisId || false,
			formdata: JSON.parse(body)
		});
	});


});

router.post('/uploadPhotos/:showcaseIndex/:uuid?', (req,res) => {
	const _uuid = req.params.uuid !== 'undefined' && req.params.uuid !=='false' ? req.params.uuid : uuid.v1();
	const photos = [];
	let showcaseIndex = req.params.showcaseIndex;

	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			const dir = 'public/uploads/'+ _uuid +'/';

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
			let filename = file.originalname.split('.')[0] + '-' + Date.now()+ '.' +extension;

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
	let data = req.body.data.data;
	let countries = req.body.country;
	let categories = req.body.category;

	let _uuid = req.body.data.uuid || uuid.v1();

	// redis save
	client.hmset(_uuid, {
		title: data.title || '',
		description: data.description || '',
		price: data.price || '',
		country: JSON.stringify(countries) || '',
		category: JSON.stringify(categories) || '',
		anotherContact: JSON.stringify(data.anotherContact) || '',
		photos: JSON.stringify(req.body.data.photos) || ''
	}, (err) => {
		if(err){
			throw err;
		}else {
			res.cookie('newAdRedisId', _uuid, { expires: new Date(Date.now() + 1200000), httpOnly: true }); // 20 min expires
			res.json( { status: 1 } );
		}
	});

});

router.post('/create', (req, res) => {
	let data = req.body.data;
	let photos = req.body.photos;
	let _uuid = req.body.uuid  || uuid.v1();
	let showcaseIndex = req.body.showcaseIndex;
	let country = req.body.country;
	let category = req.body.category;

	console.log(req.body.country);
	console.log(req.body.category);

	let ad = new Ads({
		title: data.title,
		slug: slugify(data.title, { lower:true }),
		price: data.price,
		description: data.description,
		photos: photos,
		photoShowcaseIndex: showcaseIndex,
		uuid: _uuid,
		location: {
			countryId: country.countryId,
			cityId: country.cityId,
			districtId: country.districtId,
		},
		category: {
			categoryId: category.categoryId,
			categoryChildId: category.childCategoryId
		},
		anotherContact: {
			checked: data.anotherContact.checked,
			name: data.anotherContact.name,
			phone: data.anotherContact.phone
		},
		ownerId: req.session.user._id
	});

	ad.save((err) => {
		if (err){
			res.send(err);
		}else{
			client.del(_uuid, (err) => {
				if (err)
					console.log(err);
			});

			res.clearCookie('newAdRedisId');
			res.send({ 'status': 1 });
		}
	});
});

router.get('/getAdBuffer/:uuid', (req,res) => {
	let uuid = req.params.uuid;
	client.hgetall(uuid,  (err, reply) => {
		res.json(reply);
	});
});

module.exports = router;
