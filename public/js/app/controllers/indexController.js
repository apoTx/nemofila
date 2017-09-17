app.controller('indexController', ['$scope', '$http', ($scope, $http) => {

	$scope.indexAdsLoading = true;
	$scope.init = () => {
		$scope.getIndexAds();
	};

	$scope.ads = {};
	$scope.getIndexAds = () => {
		$http({
			url: '/getIndexAds',
			method: 'GET'
		}).then((response) => {
			console.log(response);
			$scope.indexAdsLoading = false;

			$scope.ads = response.data;
		}, () => { // optional
			console.log('fail');
		});
	};
}]);
