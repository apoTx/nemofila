app.factory('favFactory', ['$http', ($http) => {
	/**
	 * @favType: 0 or 1 -> ad or event
	 * */
	let addFavourites = (userId, adId, favType ) => {
		return $http({
			url: '/detail/addFavourites',
			method: 'get',
			params: { userId: userId, adId: adId, type: favType ? favType : 0  },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let delFavourites = (userId, adId) => {
		return $http({
			url: '/detail/delFavourites',
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
		delFavourites: delFavourites,
		isFav: isFav
	};
}]);
