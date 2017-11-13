let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Conversations = require('../../models/conversation');
let Messages = require('../../models/messages');

let requireLogin = require('../inc/requireLogin.js');

// Models
let User = require('../../models/users');

// Mail transporter
let mailer = require('../../helper/mailer');

let sendMail = (toEmail, conversationId, message) => {
	let to_email = toEmail;
	let subject = 'New Message';
	let mailOptions = {
		from: mailer.config.defaultFromAddress,
		to: to_email,
		subject: subject,
		template: 'new-message',
		context: {
			siteUrl: mailer.siteUrl,
			message: message,
			conversationId: conversationId,
			subject: subject,
		}
	};

	mailer.transporter.sendMail(mailOptions, (error, info) => {
		if(error)
			console.log(error);
		else
			console.log('Message sent: ' + info.response);
	});
};

router.post('/createConversation', requireLogin, (req, res) => {
	let data = req.body;
	let object = {
		'adId': data.adId,
		'participants.fromUserId': req.session.user._id,
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

		// Messages collection
		{
			$lookup: {
				from: 'messages',
				localField: '_id',
				foreignField: 'conversationId',
				as: 'message'
			}
		},
		{
			$unwind: {
				path: '$message',
				preserveNullAndEmptyArrays: true
			}
		},

		{
			$group: {
				_id: {
					_id: '$_id',
					participants: '$participants',
					'ad': '$ad',
					'user': '$user',
				},
				messages: {
					$push: '$message'
				},
				unreadMessageCount: {
					$sum: {
						'$cond': [
							{
								'$and': [
									{ '$eq': [ '$message.read', false ] },
									{ '$eq': [ '$message.toUserId', sessionId ] }
								]
							},
							1,
							0
						]
					}
				}
			}
		},

		{
			'$project': {
				_id: '$_id._id',
				'participants': '$_id.participants',
				'user.name': '$_id.user.name',
				'user.surname': '$_id.user.surname',
				'ad.title': '$_id.ad.title',
				'ad.photos': '$_id.ad.photos',
				'ad.price': '$_id.ad.price',
				'ad.slug': '$_id.ad.slug',
				'ad._id': '$_id.ad._id',
				'ad.photoShowcaseIndex': '$_id.ad.photoShowcaseIndex',
				unreadMessageCount: 1,
			},
		},
		{ $sort: { 'unreadMessageCount':-1 } },
	], (err, result)=> {
		if (err)
			return next( err );

		console.log(result);
		res.json(result);
	});
});

router.post('/createMessage', requireLogin, (req, res) => {
	let data = req.body;

	let message = new Messages({
		conversationId: data.conversationId,
		fromUserId: req.session.user._id,
		toUserId: data.toUserId,
		message: data.message,
	});

	message.save((err) => {
		if (err){
			res.json( { error: 'Message cannot sent.', err: err } );
		}else{

			User.findById(data.toUserId, 'email', (err, findResult) => {
				sendMail(findResult.email, data.conversationId, data.message);

				res.json( {
					status: 1,
					message: 'Message created.'
				});

			});
		}
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

		// Conversations lookup
		{
			$lookup: {
				from: 'conversations',
				localField: 'conversationId',
				foreignField: '_id',
				as: 'conversation'
			}
		},
		{ '$unwind': '$conversation' },
		{
			'$project': {
				'message': 1,
				'createdAt': 1,
				'user.name': '$user.name',
				'user.surname': '$user.surname',
				'conversation.participants': '$conversation.participants',
			},
		},

		{ $sort: { createdAt: 1 } },
	], (err, result)=> {
		if (err)
			return next( err );

		let toUserId;
		if (result[0] !== undefined){
			toUserId = String(result[0].conversation.participants.toUserId) != String(req.session.user._id) ? result[0].conversation.participants.toUserId : result[0].conversation.participants.fromUserId;
			res.json({ data: result, toUserId: toUserId });
		}else{
			res.status(404).json({ message: 'Not Found' });
		}

	});
});

router.get('/getUnreadMessages', requireLogin, (req,res,next) => {
	Messages.aggregate([
		{
			'$match': {
				'toUserId': mongoose.Types.ObjectId(req.session.user._id),
				'read': false
			}
		},
		{ '$group' : { _id:'$conversationId', count:{ $sum:1 } } }
	], (err, result)=> {
		if (err)
			return next( err );

		res.json(result);
	});
});

router.get('/markAsRead', requireLogin, (req,res,next) => {
	let conversationId = req.query.conversationId;

	Messages.update({
		conversationId: conversationId,
		read: false,
		toUserId: req.session.user._id
	}, {
		read: true,
	},(err,result) => {
		if (err)
			return next( err );

		res.json(result);
	});
});

module.exports = router;
