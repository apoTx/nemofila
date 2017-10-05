app.factory('indexFactory', ['$http', ($http) => {
	let getIndexAds = () => {
		return $http.get('/getIndexAds')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let searchAd = (title) => {
		return $http({
			url: '/searchAd',
			method: 'get',
			params: { title: title },
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	return {
		getIndexAds: getIndexAds,
		searchAd: searchAd
	};
}]);
