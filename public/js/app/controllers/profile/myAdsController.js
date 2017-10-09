/*eslint-disable */
app.controller('myAdsController', ['$scope', 'myAdsFactory', function($scope, myAdsFactory){
/*eslint-enable */
	$scope.loadingMyAds = true;

	myAdsFactory.getMyAds().then((response) => {
		$scope.loadingMyAds = false;
		$scope.myAds = response;
	});
}]);
