app.factory('detailFactory', ['$http', ($http) => {
	let getSimilars = (adId) => {
		return $http({
			url: '/detail/getSimilars',
			method: 'get',
			params: { adId: adId },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let deleteAd = (uuid) => {
		return $http({
			url: '/detail/deleteAd',
			method: 'get',
			params: { uuid: uuid },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getSimilars: getSimilars,
		deleteAd: deleteAd,
	};
}]);
