describe('MongoDB Server', () => {
	it('MongoDB server connection', (done)=> {
		const config = require('../config/env.json')[process.env.NODE_ENV || 'development'];

		// Mongo connection
		const mongoose = require('mongoose');
		mongoose.connect(config.db.MONGO_URI, {
			useMongoClient: true,
		});
		const db = mongoose.connection;

		db.on('connected', () => {
			done();
		});

	});
});
