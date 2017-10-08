app.factory('adsFactory', ['$http', ($http) => {
	let getAllAds = () => {
		return $http.get('/manage/ads/getAllAds')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllAds: getAllAds,
	};
}]);
