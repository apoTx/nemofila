app.controller('reportsController', ['$scope', '$http', 'reportsFactory', '$window', ($scope, $http, reportsFactory, $window) => {

	$scope.loadingReports = true;
	reportsFactory.getAllReports().then((response) => {
		$scope.loadingReports = false;
		$scope.reports = response;
		console.log($scope.reports);
	});

}]);
