app.controller('searchController',  ['$scope', '$http', 'categoriesFactory', ($scope, $http, categoriesFactory) => {
	$http;

	console.log("test");

	$scope.init = () => {
		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
			console.log("test");
			console.log(response);
		});
	};
}]);
