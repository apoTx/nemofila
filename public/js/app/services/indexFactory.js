app.factory('indexFactory', ['$http', ($http) => {
	const getIndexAds = (page) => {
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

	const getIndexEvents = (page) => {
		return $http({
			url: '/events/getIndexEvents',
			method: 'get',
			params: { page: page }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	const searchAd = (title, location, category) => {
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
		getIndexEvents: getIndexEvents,
		searchAd: searchAd
	};
}]);
