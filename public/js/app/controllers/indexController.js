app.controller('indexController', ['$scope', '$http', ($scope, $http) => {
	$scope.init = () => {
		$scope.getIndexAds();
	};

	$scope.getIndexAds = () => {
		$http({
			url: '/getIndexAds',
			method: 'GET'
		}).then((response) => {
			console.log(response);
		}, () => { // optional
			console.log('fail');
		});
	};
}]);
