let https = require('https');

let recaptcha_secret_key= '6LeZSjgUAAAAAArD-0mpCl6jysO1cxCCli5q_FzP';

// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
	https.get('https://www.google.com/recaptcha/api/siteverify?secret=' + recaptcha_secret_key + '&response=' + key, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk.toString();
		});
		res.on('end', () => {
			try {
				let parsedData = JSON.parse(data);
				callback(parsedData.success);
			} catch (e) {
				callback(false);
			}
		});
	});
}

module.exports = verifyRecaptcha;
