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

	let unpublish = (id) => {
		return $http({
			url: '/manage/ads/unpublish',
			method: 'POST',
			data: { id: id },
		})
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
		getAllAds: getAllAds,
		publishAd: publishAd,
		unpublish: unpublish,
		advanceSearch: advanceSearch
	};
}]);
