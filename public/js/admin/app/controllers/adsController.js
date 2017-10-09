app.controller('adsController', ['$scope', '$http', 'adsFactory', ($scope, $http, adsFactory) => {
	$scope.loadingAds = true;

	adsFactory.getAllAds().then((response) => {
		$scope.loadingAds = false;
		$scope.ads = response;
	});

	$scope.changeStatus = (id) => {
		console.log(id);
	};
}]);
