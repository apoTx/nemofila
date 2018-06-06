// Redis connection
let redis = require('redis');

let client;
if (process.env.NODE_ENV == 'production' ){
	let rtg   = require('url').parse(process.env.REDIS_URL);
	client = redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(':')[1]);
}else{
	client = redis.createClient(process.env.REDIS_PORT, config.redis.URI);
}

client.on('connect', () => {
	console.log('redis server was connected!');
});
client.on('error', () => {
	console.log('error while creating the socket connection');
});

module.exports = client;
