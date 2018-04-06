app.controller('eventsEditController', ['$scope', '$http', 'eventsFactory', '$window', ($scope, $http, eventsFactory, $window) => {

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
		eventsFactory.publish($scope.adEditForm).then((response) => {
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
			eventsFactory.unpublish($scope.adEditForm.id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};

}]);
