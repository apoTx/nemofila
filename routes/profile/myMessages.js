let express = require('express');
let router = express.Router();

let Ads = require('../../models/ads');
let Conversations = require('../../models/conversation');
let Messages = require('../../models/messages');

let requireLogin = require('../inc/requireLogin.js');

router.post('/createConversation', requireLogin, (req, res) => {
	let data = req.body;
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
			conversation.save((err, data) => {
				if (err)
					res.json({ error: 'Message cannot sent.' });
				else
					res.json({
						status: 1,
						conversationId: data._id,
						message: 'Conversation created.'
					});
			});
		}else{
			res.json({
				status: 1,
				conversationId: data._id,
				message: 'This conversation already exists.'
			});
		}
	});
});

router.post('/createMessage', requireLogin, (req, res) => {
	let data = req.body;

	let message = new Messages({
		conversationId: data.conversationId,
		fromUserId: data.fromUserId,
		message: data.message,
	});

	message.save((err) => {
		if (err)
			res.json( { error: 'Message cannot sent.' } );
		else
			res.json( {
				status: 1,
				message: 'Message created.'
			} );
	});
});

module.exports = router;
