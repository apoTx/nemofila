app.factory('rateFactory', ['$http', ($http) => {

	let setRate = (adId, score ) => {
		return $http({
			url: '/detail/setRate',
			method: 'get',
			params: { adId: adId, score: score },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		setRate: setRate,
	};
}]);
