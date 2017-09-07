describe('Redis Server', () => {
	it('Redis server connection', (done)=> {
		let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
		let redis = require('redis');
		let client = redis.createClient(config.redis.PORT, config.redis.URI);

		client.on('connect', () => {
			done();
		});
	});
});