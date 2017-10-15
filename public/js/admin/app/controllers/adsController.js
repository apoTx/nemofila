app.controller('adsController', ['$scope', '$http', 'adsFactory', '$window', ($scope, $http, adsFactory, $window) => {
	$scope.loadingAds = true;

	adsFactory.getAllAds().then((response) => {
		$scope.loadingAds = false;
		$scope.ads = response;
	});

	$scope.changeStatus = (id) => {
		console.log(id);
	};


	$scope.adEditForm = { };
	$scope.adEditForm.publishStatus = '1';
	$scope.adEditForm.reasonVisible = false;

	$scope.changeStatus = () => {
		if ($scope.adEditForm.publishStatus === '2')
			$scope.adEditForm.reasonVisible = true;
		else
			$scope.adEditForm.reasonVisible = false;
	};

	$scope.submitEdit = () => {
		$scope.loadingEditSubmit = true;
		adsFactory.publishAd($scope.adEditForm).then((response) => {
			console.log(response);
			$scope.loadingEditSubmit = false;

			if (response.status === 1){
				$window.location.reload();
			}
		});
	};

	$scope.unpublish = () => {
		let r = confirm('Are you sure?');
		if (r === true) {
			$scope.loadingUnpublish = true;
			adsFactory.unpublish($scope.adEditForm.id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};

}]);
