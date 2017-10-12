app.factory('messageFactory', ['$http', ($http) => {
	let createConversation = (data) => {
		console.log(data);
		return $http({
			url: '/profile/myMessages/createConversation',
			method:'POST',
			data: data
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
