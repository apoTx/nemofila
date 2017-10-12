app.factory('messageFactory', ['$http', ($http) => {
	let createConversation = (data) => {
		return $http({
			url: '/profile/myMessages/createConversation',
			method:'GET',
			params: data
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		createConversation: createConversation,
	};
}]);
