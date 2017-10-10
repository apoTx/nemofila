app.factory('layoutFactory', ['$http', ($http) => {
	let signIn = (data, autoLogin) => {
		return $http({
			url: '/login',
			method: 'POST',
			data: { 'data' : data, 'autoLogin': autoLogin }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	let signUp = (data) => {
		return $http({
			url: '/register',
			method: 'POST',
			data: { 'data' : data }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	let forgotPassword = (email) => {
		return $http({
			url: '/forgotPassword',
			method: 'POST',
			data: { 'email' : email }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	return {
		signIn: signIn,
		signUp: signUp,
		forgotPassword: forgotPassword
	};
}]);
