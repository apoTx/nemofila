// Redis connection
let redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1');

client.on('connect', () => {
	console.log('redis server was connected!');
});

client.on('error', () => {
	console.log('error while creating the socket connection');
});

module.exports = client;