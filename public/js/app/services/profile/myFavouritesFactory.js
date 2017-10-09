app.factory('myFavouritesFactory', ['$http', ($http) => {
	let getMyFavourites = () => {
		return $http.get('profile/myFavourites/getMyFavourites')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getMyFavourites: getMyFavourites
	};
}]);
