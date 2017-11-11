app.controller('usersController', ['$scope', '$http', 'usersFactory', ($scope, $http, usersFactory) => {

	$scope.loadingUsers = true;

	usersFactory.getAllUsers().then((response) => {
		$scope.loadingAds = false;
		$scope.users = response;
	});

}]);
