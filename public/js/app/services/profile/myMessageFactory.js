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

	let createMessage = (data, conversationId) => {
		return $http({
			url: '/profile/myMessages/createMessage',
			method:'POST',
			data: {
				fromUserId: data.fromUserId,
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

	return {
		createConversation: createConversation,
		createMessage: createMessage,
	};
}]);
