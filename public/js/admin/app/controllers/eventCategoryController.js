app.controller('eventCategoryController', ['$scope', '$http',  ($scope, $http) => {
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
			url: path +'/event-categories/getEventCategories',
			method: 'GET',
		}).then((response) => {
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
				url: path +'/event-categories/saveEventCategory',
				method: 'POST',
				data: { 'name': $scope.categories.form.category.name, type: 1 }
			}).then((response) => {
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
				if (response.data.status === 1){
					try{
						$scope.categories.list[$scope.categories.selected.index].subCategories.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.categories.list[$scope.categories.selected.index].subCategories = [];
						$scope.categories.list[$scope.categories.selected.index].subCategories.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.categories.form.subCategory.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteCategory = (index) => {
		let confirm = window.confirm('Are you sure ?');
		if (confirm){
			$http({
				url: path +'/event-categories/deleteEventCategory',
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

	$scope.deleteSubCategory = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/categories/deleteSubCategory',
				method: 'DELETE',
				data: {
					'_id': $scope.categories.list[$scope.categories.selected.index].subCategories[index]._id,
					'categoryId': $scope.categories.selected._id
				},
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.categories.list[$scope.categories.selected.index].subCategories.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};
}]);
