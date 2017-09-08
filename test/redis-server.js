describe('Redis Server', () => {
	it('Redis server connection', (done)=> {
		let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
		let redis = require('redis');

		if (process.env.NODE_ENV == 'production' ){
			let rtg   = require('url').parse(config.redis.URI);
			let client = redis.createClient(rtg.port, rtg.hostname);

			client.auth(rtg.auth.split(':')[1]);

			client.on('connect', () => {
				done();
			});

		}else{
			let client = redis.createClient(config.redis.PORT, config.redis.URI);

			client.on('connect', () => {
				done();
			});
		}
	});
});