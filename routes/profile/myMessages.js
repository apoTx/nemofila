let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

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
			'$match': {
				$or:[
					{ 'participants.fromUserId': sessionId },
					{ 'participants.toUserId': sessionId }
				],
			}
		},

		// User lookup
		{
			$lookup: {
				from: 'users',
				localField: 'participants.toUserId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },

		// Ad lookup
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

router.get('/getMessages', requireLogin, (req,res,next) => {
	let conversationId = req.query.conversationId;

	Messages.aggregate([
		{
			'$match': {
				'conversationId': mongoose.Types.ObjectId(conversationId) ,
			}
		},

		// User lookup
		{
			$lookup: {
				from: 'users',
				localField: 'fromUserId',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ '$unwind': '$user' },
		{
			'$project': {
				'message': 1,
				'createdAt': 1,
				'user.name': '$user.name',
				'user.surname': '$user.surname',
			},
		},
	], (err, result)=> {
		if (err)
			return next( err );

		console.log( result );
		res.json(result);

	});
});

module.exports = router;
