app.controller('adsController', ['$scope', '$http', 'adsFactory', ($scope, $http, adsFactory) => {

	$scope.loadingAds = true;

	adsFactory.getAllAds().then((response) => {
		$scope.loadingAds = false;
		console.log(response);

		$scope.ads = response;
	});
}]);
