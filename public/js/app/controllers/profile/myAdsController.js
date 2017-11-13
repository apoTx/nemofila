/*eslint-disable */
app.controller('myAdsController', ['$scope', 'myAdsFactory', '$window', function($scope, myAdsFactory, $window){
/*eslint-enable */
	$scope.loadingMyAds = true;

	myAdsFactory.getMyAds().then((response) => {
		$scope.loadingMyAds = false;
		$scope.myAds = response;
	});

	$scope.onUnpublish = (id) => {
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

	$scope.update = (id) => {
		myAdsFactory.update(id).then((response) => {
			console.log(response);
		});
	};
}]);
