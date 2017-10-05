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
			$scope.indexAdsLoading = false;
			$scope.ads = response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	$scope.searchForm = { };
	$scope.onSubmit = () => {
		$scope.indexAdsLoading = true;

		$http({
			url: '/searchAd',
			method: 'get',
			params: { title: $scope.searchForm.title },
		}).then((response) => {
			console.log(response);
			$scope.indexAdsLoading = false;
			$scope.ads = response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

}]);
