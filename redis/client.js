// Redis connection
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
let redis = require('redis');

let client;
if (process.env.NODE_ENV == 'production' ){
	let rtg   = require('url').parse(config.redis.URI);
	client = redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(':')[1]);
}else{
	client = redis.createClient(config.redis.PORT, config.redis.URI);
}

client.on('connect', () => {
	console.log('redis server was connected!');
});
client.on('error', () => {
	console.log('error while creating the socket connection');
});

module.exports = client;