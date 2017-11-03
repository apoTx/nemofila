/*
describe('Redis Server', () => {
	it('Redis server connection', (done)=> {
		let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
		let redis = require('redis');

		let client;
		if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging' ){
			let rtg   = require('url').parse(config.redis.URI);
			client = redis.createClient(rtg.port, rtg.hostname);
			client.auth(rtg.auth.split(':')[1]);
		}else{
			client = redis.createClient(config.redis.PORT, config.redis.URI);
		}

		client.on('connect', () => {
			done();
		});

	});
});
*/
