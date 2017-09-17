app.controller('indexController', ['$scope', '$http', ($scope, $http) => {
	$scope.init = () => {

	};

	$scope.getIndexAds = () => {
		$http({
			url: '/getIndexAds',
			method: 'POST',
			data: data
		}).then((response) => {
			$scope.newAdBtnLoading = false;
			if (response.data.status === 1) {
				completeSaveAd();
			}
		}, () => { // optional
			console.log('fail');
		});
	};
}]);
