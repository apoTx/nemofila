describe('MongoDB Server', () => {
	it('MongoDB server connection', (done)=> {
		let config = require('../config/env.json')[process.env.NODE_ENV || 'development'];
		// Mongo connection
		let mongoose = require('mongoose');
		mongoose.connect(config.db.MONGO_URI, {
			useMongoClient: true,
		});
		let db = mongoose.connection;

		db.on('connected', () => {
			done();
		});

	});
});
