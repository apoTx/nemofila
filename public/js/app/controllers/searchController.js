app.controller('searchController',  ['$scope', '$http', 'categoriesFactory', 'searchFactory', ($scope, $http, categoriesFactory, searchFactory) => {
	$http;

	$(() => {
		$('.rating').rating({
			maxRating: 5,
			interactive: false
		});
	});

	$scope.init = () => {
		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
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
			console.log($scope.events);
		});
	};

}]);
