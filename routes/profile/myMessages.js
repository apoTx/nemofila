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

router.get('/getConversations', requireLogin, (req, res, next) => {
	let sessionId = req.session.user._id;

	Conversations.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'participants.fromUserId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },
		{
			'$match': {
				$or:[
					{ 'participants.fromUserId': sessionId },
					{ 'participants.toUserId': sessionId }
				],
			}
		},

		{
			$lookup: {
				from: 'ads',
				localField: 'adId',
				foreignField: '_id',
				as: 'ad'
			}
		},
		{ '$unwind': '$ad' },

		{
			'$project': {
				'participants': 1,
				'user.name': '$user.name',
				'user.surname': '$user.surname',
				'ad.title': '$ad.title'
			},
		},
	], (err, result)=> {
		if (err)
			return next( err );

		console.log( result );
		res.json(result);

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
