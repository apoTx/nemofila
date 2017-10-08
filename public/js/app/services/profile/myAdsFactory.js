app.factory('myAdsFactory', ['$http', ($http) => {
	let getMyAds = () => {
		return $http.get('profile/adsMy/getMyAds')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getMyAds: getMyAds
	};
}]);
