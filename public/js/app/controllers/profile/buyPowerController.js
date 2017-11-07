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

	$scope.powerNumber = '0';
	$scope.buyPowerLoader = false;
	$scope.buyPowerStatus = false;

	$(() => {
		// stripe
		$('#buttonCheckout').on('click', () => {
			$scope.powerNumber = ($scope.powerNumber.split(':'))[1];
			console.log($scope.powerNumber);
			if(parseInt($scope.powerNumber) > 0)
				checkoutHandler.open({
					name: 'Easyad',
					description: 'Power Purchase',
					token: handleToken
				});
		});

		$('.powerNumber').on('change', () => {
			$scope.powerNumber = $('.powerNumber').val();
		});

		function handleToken(token) {
			$scope.buyPowerLoader = true;
			$scope.$apply();
			fetch('/charge', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Object.assign(token, { amount: parseInt($scope.powerNumber) })),
			})
				.then(output => {
					if (output.statusText === 'OK') {
						buyPowerFactory.savePower($routeParams.id, $scope.powerNumber).then((result) => {
							$scope.buyPowerLoader = false;
							$scope.buyPowerStatus = true;
						});
					}
				});
		}
		// # stripe
	});

}]);
