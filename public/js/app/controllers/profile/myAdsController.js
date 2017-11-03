/*eslint-disable */
app.controller('myAdsController', ['$scope', 'myAdsFactory', '$window', function($scope, myAdsFactory, $window){
/*eslint-enable */
	$scope.loadingMyAds = true;

	console.log('asd');

	myAdsFactory.getMyAds().then((response) => {
		$scope.loadingMyAds = false;
		$scope.myAds = response;
	});

	$scope.unpublish = (id) => {
		console.log(id);

		let r = confirm('Are you sure?');
		if (r === true) {
			$scope.loadingUnpublish = true;
			myAdsFactory.unpublish(id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};

}]);
