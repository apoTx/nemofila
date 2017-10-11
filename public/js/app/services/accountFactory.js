app.factory('accountFactory', ['$http', ($http) => {
	let resetPassword = (data) => {
		console.log(data);
		return $http({
			url: '/account/reset_password',
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
		resetPassword: resetPassword,
	};
}]);
