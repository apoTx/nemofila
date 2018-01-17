app.controller('searchController',  ['$scope', '$http', 'categoriesFactory', ($scope, $http, categoriesFactory) => {
	$http;

	$scope.init = () => {
		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
		});
	};
}]);
