app.factory('favFactory', ['$http', ($http) => {
	/**
	 * @favType: 0 or 1 -> ad or event
	 * */
	let addFavourites = (adId, favType ) => {
		return $http({
			url: '/detail/addFavourites',
			method: 'get',
			params: { adId, type: favType ? favType : 0  },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let delFavourites = adId => {
		return $http({
			url: '/detail/delFavourites',
			method: 'get',
			params: { adId },
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
			params: { userId, adId },
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
