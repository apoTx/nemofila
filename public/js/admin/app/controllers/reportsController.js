app.controller('reportsController', ['$scope', '$http', 'reportsFactory', ($scope, $http, reportsFactory) => {

	$scope.loadingReports = true;
	reportsFactory.getAllReports().then((response) => {
		$scope.loadingReports = false;
		$scope.reports = response;
	});

}]);
