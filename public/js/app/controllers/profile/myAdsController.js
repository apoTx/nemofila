/*eslint-disable */
app.controller('myAdsController', ['$scope', '$http', 'myAdsFactory',  function($scope, $http, myAdsFactory){
/*eslint-enable */
	$scope.loadingMyAds = true;

	myAdsFactory.getMyAds().then((response) => {
		$scope.loadingMyAds = false;
		$scope.myAds = response;
	});
}]);
