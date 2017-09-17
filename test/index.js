let chai = require('chai');
let chaiHttp = require('chai-http');
/*eslint-disable */
let should = chai.should();
/*eslint-enable*/
let server = require('../app');

chai.use(chaiHttp);


describe('Node Server', () => {
	it('(GET /) returns the homepage', (done)=> {
		chai.request(server)
			.get('/')
			.end( (err, res) => {
				res.should.have.status(200);
				done();
			});
	});

	describe('Index API', () => {
		it('(GET /getIndexAds) response status should 200', (done) => {
			chai.request(server)
				.get('/getIndexAds')
				.end( (err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
