app.factory('adsFactory', ['$http', ($http) => {
	let getAllAds = () => {
		return $http.get('/manage/ads/getAllAds')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let publishAd = (data) => {
		console.log(data);
		return $http({
			url: '/manage/ads/publishAd',
			method: 'POST',
			data: data,
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllAds: getAllAds,
		publishAd: publishAd,
	};
}]);
