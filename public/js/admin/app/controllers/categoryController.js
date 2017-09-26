app.controller('categoryController', ['$scope', '$http',  ($scope, $http) => {
	$scope.categories = {
		selected: {
			index: 0,
			_id: 0
		},
		form: {
			category: {
				name: ''
			},
			subCategory: {
				name: '',
			},
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
		subCategory: false,
	};

	$scope.init = () => {
		$http({
			url: path +'/categories/getCategories',
			method: 'GET',
		}).then((response) => {
			console.log(response);
			$scope.categories.list = response.data;
		}, () => { // optional
			console.log('fail');
		});

	};

	$scope.selectCategory = (index) => {
		$scope.visibles.subCategory = true;
		$scope.categories.selected.index = index;
		$scope.categories.selected._id = $scope.categories.list[index]._id;
	};

	$scope.saveCategory = () => {
		if ($scope.categories.form.category.name !== ''){
			$http({
				url: path +'/categories/saveCategory',
				method: 'POST',
				data: { 'name': $scope.categories.form.category.name }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1) {
					$scope.categories.list.push( { name: response.data.name, _id: response.data._id } );
					$scope.categories.form.category.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveSubCategory = () => {
		if ($scope.categories.form.subCategory.name !== ''){
			$http({
				url: path +'/categories/saveSubCategory',
				method: 'POST',
				data: { 'name': $scope.categories.form.subCategory.name, 'countryId': $scope.categories.selected._id }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1){
					try{
						$scope.categories.list[$scope.categories.selected.index].subCategories.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.categories.list[$scope.categories.selected.index].subCategories = [];
						$scope.categories.list[$scope.categories.selected.index].subCategories.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.categories.form.city.name = '';
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
				url: path +'/categories/deleteCountry',
				method: 'DELETE',
				data: { '_id': $scope.categories.list[index]._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.categories.list.splice(index, 1);
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
				url: path +'/categories/deleteCity',
				method: 'DELETE',
				data: { '_id': $scope.categories.list[$scope.categories.selected.index].cities[index]._id, 'countryId': $scope.categories.selected._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.categories.list[$scope.categories.selected.index].cities.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};
}]);
