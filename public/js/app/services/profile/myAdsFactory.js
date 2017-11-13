app.factory('myAdsFactory', ['$http', ($http) => {
	let getMyAds = () => {
		return $http.get('profile/adsMy/getMyAds')
			.then((response) => {
				return response.data;
			});
	};

	let unpublish = (id) => {
		return $http({
			url: 'profile/adsMy/unpublish',
			method: 'POST',
			data: { id: id },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let update = (id) => {
		return $http({
			url: 'profile/adsMy/update',
			method: 'POST',
			data: { id: id },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getMyAds: getMyAds,
		unpublish: unpublish,
		update: update
	};
}]);
