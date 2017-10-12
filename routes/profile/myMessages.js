let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads');
let Conversations = require('../../models/conversation');

let requireLogin = require('../inc/requireLogin.js');

/* GET users listing. */
router.get('/createConversation', requireLogin, (req, res) => {
	let data = req.query;
	let object = {
		'adId': data.adId,
		'participants.fromUserId': data.fromUserId,
		'participants.toUserId': data.toUserId,
	};

	Conversations.findOne( object, (err, data) => {
		if (err)
			throw (err);

		if (data === null){
			let conversation = new Conversations(object);
			conversation.save((err) => {
				if (err)
					res.json({ error: 'Message was not send.' });
				else
					res.json({ status: 1, message: 'Conversation created.' });
			});
		}else{
			res.json({ status: 1, message: 'This conversation already exists.' });
		}
	});
});

module.exports = router;
