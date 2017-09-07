// Redis connection
let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
let redis = require('redis');
let client = redis.createClient(config.redis.PORT, config.redis.URI);

client.on('connect', () => {
	console.log('redis server was connected!');
});

client.on('error', () => {
	console.log('error while creating the socket connection');
});

module.exports = client;