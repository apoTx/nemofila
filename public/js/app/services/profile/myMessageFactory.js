app.factory('messageFactory', ['$http', ($http) => {
	let createConversation = (data) => {
		return $http({
			url: '/profile/myMessages/createConversation',
			method:'POST',
			data: {
				adId: data.adId,
				fromUserId: data.fromUserId,
				toUserId: data.toUserId
			}
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getConversations = () => {
		return $http({
			url: '/profile/myMessages/getConversations',
			method:'GET',
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let createMessage = (data, conversationId) => {
		return $http({
			url: '/profile/myMessages/createMessage',
			method:'POST',
			data: {
				toUserId: data.toUserId,
				message: data.message,
				conversationId: conversationId,
			}
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getMessages = (conversationId) => {
		return $http({
			url: '/profile/myMessages/getMessages',
			method:'GET',
			params: { conversationId: conversationId }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getUnreadMessages = () => {
		return $http({
			url: '/profile/myMessages/getUnreadMessages',
			method:'GET',
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let markAsRead = (conversationId, toUserId) => {
		return $http({
			url: '/profile/myMessages/markAsRead',
			method:'GET',
			params: { conversationId: conversationId, toUserId: toUserId }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		createConversation: createConversation,
		getConversations: getConversations,
		createMessage: createMessage,
		getMessages: getMessages,
		getUnreadMessages: getUnreadMessages,
		markAsRead: markAsRead
	};
}]);
