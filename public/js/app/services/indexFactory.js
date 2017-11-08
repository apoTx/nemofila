app.factory('indexFactory', ['$http', ($http) => {
	let getIndexAds = (page) => {
		return $http({
			url: '/getIndexAds',
			method: 'get',
			params: { page: page }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let searchAd = (title, location, category) => {
		return $http({
			url: '/searchAd',
			method: 'get',
			params: { title: title, location: location, category: category },
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
