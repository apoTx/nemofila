app.controller('searchController',  ['$scope', 'categoriesFactory', 'searchFactory', ($scope, categoriesFactory, searchFactory) => {

	$(() => {
		$('.rating').rating({
			maxRating: 5,
			interactive: false
		});
	});

	$scope.init = (categoryId, subCategoryId) => {
		$scope.searchForm = {};
		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;

			try{
				const categoryIndex = $scope.categories.findIndex(x => x._id == categoryId);
				const subCategoryIndex = $scope.categories[categoryIndex].subCategories.findIndex(x => x._id == subCategoryId);

				$scope.searchForm.category = String(categoryIndex);
				$scope.searchForm.categoryChild = String(subCategoryIndex);
			}catch (e){
				//
			}

		});
	};

	$scope.$watch('place', () => {
		if ($scope.place.address_components){
			$scope.placeLongName = $scope.place.address_components[0].long_name;
		}
	});

	$scope.loadingEvents = false;
	$scope.showEvents = (placeLongName) => {
		$scope.loadingEvents = true;
		searchFactory.getEventsByLocationName(placeLongName).then((result) => {
			$scope.events = result;
			$scope.loadingEvents = true;
		});
	};

}]);
