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
		},
		list: []
	};

	$scope.init = () => {
		$http({
			url: path +'/countries/getCountries',
			method: 'GET',
		}).then((response) => {
			console.log(response);
			$scope.countries.list = response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	$scope.removeCountry = () => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/countries/deleteCountry',
				method: 'DELETE',
			}).then((response) => {
				console.log(response);
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveCountry = () => {
		if ($scope.countries.form.country.name != ''){
			$http({
				url: path +'/countries/saveCountry',
				method: 'POST',
				data: { 'name': $scope.countries.form.country.name }
			}).then((response) => {
				console.log(response);
				$scope.countries.list.push({ name: response.data.name, _id: response.data._id });
				$scope.countries.form.country.name = '';
			}, () => { // optional
				console.log('fail');
			});
		}
	};

}]);
