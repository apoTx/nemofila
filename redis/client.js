// Redis connection
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
let redis = require('redis');

if (process.env.NODE_ENV == 'development' ){

	let rtg   = require('url').parse('redis://h:pcc52bf7ac18d85f1f5edb2b41cdeded48b7082b5ddfe187a60f727a294b48f39@ec2-52-21-74-44.compute-1.amazonaws.com:36109');
	let client = redis.createClient(rtg.port, rtg.hostname);

	client.auth(rtg.auth.split(':')[1]);

	client.on('connect', () => {
		console.log('redis server was connected!');
	});

	client.on('error', () => {
		console.log('error while creating the socket connection');
	});

}else{

	let client = redis.createClient(config.redis.PORT, config.redis.URI);

	client.on('connect', () => {
		console.log('redis server was connected!');
	});

	client.on('error', () => {
		console.log('error while creating the socket connection');
	});
}

