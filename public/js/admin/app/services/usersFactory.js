app.factory('usersFactory', ['$http', ($http) => {
	let getAllUsers = () => {
		return $http.get('/manage/users/getAllUsers')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let advanceSearch = (data) => {
		return $http({
			url: '/manage/ads/advanceSearch',
			method: 'GET',
			params: { data: data },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllUsers: getAllUsers,
		advanceSearch: advanceSearch
	};
}]);
