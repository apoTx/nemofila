app.factory('myAdsFactory', ['$http', ($http) => {
	let getMyAds = () => {
		return $http.get('profile/myads/getMyAds')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getMyAds: getMyAds
	};
}]);
