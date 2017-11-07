/*eslint-disable */
app.controller('buyPowerController', ['$scope', 'buyPowerFactory', '$window', '$routeParams', function($scope, buyPowerFactory, $window, $routeParams){
/*eslint-enable */

	if ($routeParams.id){
		let id = $routeParams.id;
		$scope.loadingAd = true;
		buyPowerFactory.getAd(id).then((result) => {
			console.log(result);
			$scope.loadingAd = false;
			$scope.ad = result;
		});
	}

}]);
