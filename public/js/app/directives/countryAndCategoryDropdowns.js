app.directive('countryAndCategoryDropdowns', () => {
	return {
		link: function($scope) {
			$scope.select = function(category) {
				$scope.visiblesCategories.subCategory = false;
				$scope.categoryIndex = $scope.categories.findIndex(x => x._id ===  category._id);
				console.log("index", $scope.categoryIndex);
				$scope.newAdForm.category = $scope.categoryIndex;
			};


			$scope.visiblesCategories = {
				subCategory: true,
			};
		}
	};
});
