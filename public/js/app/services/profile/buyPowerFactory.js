app.factory('buyPowerFactory', ['$http', ($http) => {
	let getAd = (id) => {
		return $http({
			url: 'profile/buyPower/getAdById',
			method:'GET',
			params: { id: id }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAd: getAd,
	};
}]);
