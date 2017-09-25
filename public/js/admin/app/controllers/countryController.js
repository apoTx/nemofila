app.controller('countryController', ['$scope', '$http',  ($scope, $http) => {
	$scope.countries = {
		form: {
			country: {
				name: ''
			},
			city: {
				name: '',
			},
			district: {
				name: ''
			}
		}
	};

	$scope.saveCountry = () => {
		$http({
			url: path +'/countries/saveCountry',
			method: 'POST',
			data: { 'name': $scope.countries.form.country.name }
		}).then((response) => {
			console.log(response);
			$scope.countries.form.country.name = '';
		}, () => { // optional
			console.log('fail');
		});
	};

}]);
