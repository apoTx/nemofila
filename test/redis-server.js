/*
describe('Redis Server', () => {
	it('Redis server connection', (done)=> {
		let redis = require('redis');

		let client;
		if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging' ){
			let rtg   = require('url').parse(process.env.REDIS_URI);
			client = redis.createClient(rtg.port, rtg.hostname);
			client.auth(rtg.auth.split(':')[1]);
		}else{
			client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URI);
		}

		client.on('connect', () => {
			done();
		});

	});
});
*/
