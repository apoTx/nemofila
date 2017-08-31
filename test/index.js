let chai = require('chai');
let chaiHttp = require('chai-http');
/*eslint-disable */
let should = chai.should();
/*eslint-enable*/
let server = require('../app');

chai.use(chaiHttp);


describe('Node Server', () => {
	it('(GET /api) returns the homepage', (done)=> {
		chai.request(server)
			.get('/')
			.end( (err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});