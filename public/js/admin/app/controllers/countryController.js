app.controller('countryController', ['$scope', '$http',  ($scope, $http) => {
	$scope.countries = {
		selected: {
			index: 0,
			_id: 0
		},
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

	$scope.city = {
		selected: {
			index: 0,
			_id: 0
		}
	};

	$scope.visibles = {
		cities: false,
		district: false
	};

	$scope.init = () => {
		$http({
			url: path +'/countries/getCountries',
			method: 'GET',
		}).then((response) => {
			$scope.countries.list = response.data;
		}, () => { // optional
			console.log('fail');
		});

	};

	$scope.selectCountry = (index) => {
		$scope.visibles.cities = true;
		$scope.visibles.district = false;
		$scope.countries.selected.index = index;
		$scope.countries.selected._id = $scope.countries.list[index]._id;
	};

	$scope.selectCity = (index) => {
		$scope.visibles.district = true;
		$scope.city.selected.index = index;
		$scope.city.selected._id = $scope.countries.list[$scope.countries.selected.index].cities[index]._id;
	};

	$scope.saveCountry = () => {
		if ($scope.countries.form.country.name !== ''){
			$http({
				url: path +'/countries/saveCountry',
				method: 'POST',
				data: { 'name': $scope.countries.form.country.name }
			}).then((response) => {
				if (response.data.status === 1) {
					$scope.countries.list.push( { name: response.data.name, _id: response.data._id } );
					$scope.countries.form.country.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveCity = () => {
		if ($scope.countries.form.city.name !== ''){
			$http({
				url: path +'/countries/saveCity',
				method: 'POST',
				data: { 'name': $scope.countries.form.city.name, 'countryId': $scope.countries.selected._id }
			}).then((response) => {
				if (response.data.status === 1){
					try{
						$scope.countries.list[$scope.countries.selected.index].cities.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.countries.list[$scope.countries.selected.index].cities = [];
						$scope.countries.list[$scope.countries.selected.index].cities.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.countries.form.city.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveDistrict = () => {
		if ($scope.countries.form.district.name !== ''){
			$http({
				url: path +'/countries/saveDistrict',
				method: 'POST',
				data: { 'name': $scope.countries.form.district.name, 'countryId': $scope.countries.selected._id, 'cityId': $scope.city.selected._id, 'cityIndex':$scope.city.selected.index  }
			}).then((response) => {
				if (response.data.status === 1){
					try{
						$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts = [];
						$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.countries.form.district.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteCountry = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/countries/deleteCountry',
				method: 'DELETE',
				data: { '_id': $scope.countries.list[index]._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.countries.list.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteCity = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/countries/deleteCity',
				method: 'DELETE',
				data: { '_id': $scope.countries.list[$scope.countries.selected.index].cities[index]._id, 'countryId': $scope.countries.selected._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.countries.list[$scope.countries.selected.index].cities.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteDistrict = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/countries/deleteDistrict',
				method: 'DELETE',
				data: {
					'_id': $scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts[index]._id,
					'cityId': $scope.city.selected._id,
					'countryId': $scope.countries.selected._id
				},
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

}]);
