app.controller('searchController',  ['$scope', '$http', 'categoriesFactory', ($scope, $http, categoriesFactory) => {
	$http;

	$scope.init = () => {
		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
		});
	};

	$scope.$watch('place', () => {
		console.log($scope.place);
		if ($scope.place.address_components){
			$scope.placeLongName = $scope.place.address_components[0].long_name;
		}
	});

}]);
