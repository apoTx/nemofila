describe('MongoDB Server', () => {
	it('MongoDB server connection', (done)=> {

		// Mongo connection
		const mongoose = require('mongoose');
		mongoose.connect(process.env.MONGO_URI, {
			useMongoClient: true,
		});
		const db = mongoose.connection;

		db.on('connected', () => {
			done();
		});

	});
});
