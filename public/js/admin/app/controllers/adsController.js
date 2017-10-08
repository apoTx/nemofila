app.controller('adsController', ['$scope', '$http', 'adsFactory', ($scope, $http, adsFactory) => {
	adsFactory.getAllAds().then((response) => {
		console.log(response);
	});
}]);
