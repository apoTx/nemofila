app.factory('contactFactory', ['$http', ($http) => {
	let sendMessage = (data) => {
		return $http({
			url: '/contact',
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
		sendMessage: sendMessage,
	};
}]);
