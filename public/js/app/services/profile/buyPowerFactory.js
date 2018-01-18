app.factory('buyPowerFactory', ['$http', ($http) => {
	let getAd = (id) => {
		return $http({
			url: '/getAdById',
			method:'GET',
			params: { id: id }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let savePower = (adId, powerNumber) => {
		return $http({
			url: 'profile/buyPower/savePower',
			method: 'POST',
			data: { adId: adId, powerNumber: powerNumber },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAd: getAd,
		savePower: savePower
	};
}]);
