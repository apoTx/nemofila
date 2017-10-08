/*eslint-disable */
app.controller('myAdsController', ['$scope', '$http', 'myAdsFactory',  function($scope, $http, myAdsFactory){
/*eslint-enable */
	$scope.data = 1;

	myAdsFactory.getMyAds().then((response) => {
		console.log(response);
	});
}]);
