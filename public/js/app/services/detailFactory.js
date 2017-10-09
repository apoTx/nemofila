app.factory('detailFactory', ['$http', ($http) => {
	let addFavourites = (userId, adId) => {
		return $http({
			url: '/detail/addFavourites',
			method: 'get',
			params: { userId: userId, adId: adId },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let isFav = (userId, adId) => {
		return $http({
			url: '/detail/isFav',
			method: 'get',
			params: { userId: userId, adId: adId },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		addFavourites: addFavourites,
		isFav: isFav
	};
}]);
