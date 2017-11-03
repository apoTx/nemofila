let express = require('express');
let client = require('../redis/client.js');
let fs = require('fs');
let slugify = require('slugify');
let request = require('request');

let requireLogin = require('./inc/requireLogin.js');

let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
let getAdStatusText = require('../helper/getAdStatusText');

// Models
let Ads = require('../models/ads');

// uuid
let uuid = require('uuid');

// Multer
let multer  = require('multer');

// Express router
let router = express.Router();


/* GET users listing. */
router.get('/:id?', requireLogin, (req, res) => {
	request('http://jqueryegitimseti.com/amazon-service.php', (error, response, body) => {
		res.render( 'newAd', {
			title: 'New Ad',
			userExists: req.session.user ? true : false,
			id: req.query.id ? req.query.id : 'false',
			formdata: JSON.parse(body),
			amazon_base_url: config.amazon_s3.photo_base_url
		});
	});
});

router.post('/uploadPhotos/:showcaseIndex/:uuid?',  (req,res) => {
	const _uuid = req.params.uuid !== 'undefined' && req.params.uuid !=='false' ? req.params.uuid : uuid.v1();
	let photos = [];
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

router.post('/create', requireLogin, (req, res) => {
	let data = req.body.data;
	let power = req.body.power;
	let photos = req.body.photos;
	let _uuid = req.body.uuid  || uuid.v1();
	let showcaseIndex = req.body.showcaseIndex;
	let country = req.body.country;
	let category = req.body.category;
	let isEdit = req.body.isEdit;
	let editId = req.body.editId;


	let obj = {
		title: data.title,
		slug: slugify(data.title, { lower:true }),
		price: data.price,
		description: data.description,
		photos: photos,
		photoShowcaseIndex: showcaseIndex,
		power: {
			powerStatus: power.powerStatus,
			powerNumber: power.powerStatus ? power.powerNumber : 0
		},
		uuid: _uuid,
		location: {
			countryId: country.countryId,
			cityId: country.cityId,
			districtId: country.districtId,
		},
		category: {
			categoryId: category.categoryId,
			categoryChildId: category.childCategoryId
		}
	};

	if (data.anotherContact.checked){
		Object.assign( obj,  {
			checked: data.anotherContact.checked,
			name: data.anotherContact.name,
			phone: data.anotherContact.phone
		});
	}

	if (!isEdit) {
		let ad = new Ads(Object.assign(obj, { ownerId: req.session.user._id }));

		ad.save( (err) => {
			if (err) {
				res.send( err );
			} else {
				client.del( _uuid, (err) => {
					if (err)
						console.log( err );
				} );

				res.clearCookie( 'newAdRedisId' );
				res.send( { 'status': 1 } );
			}
		} );
	}else {
		Ads.findOneAndUpdate({ '_id': editId }, Object.assign(obj, { status: 0, statusText: getAdStatusText(0) }), { upsert:true }, (err) => {
			if (err)
				throw new Error(err);

			res.send( { 'status': 1 } );
		});
	}
});

router.get('/getEditAd/:id', requireLogin, (req,res) => {
	Ads.findById( req.params.id, (err,data) => {
		if (err)
			throw new Error();

		console.log(data);
		res.json(data);
	});
});

module.exports = router;
