app.controller('profileController', ['$scope', '$http',  ($scope, $http) => {
	$scope,$http;
}]);

app.config(['$routeProvider', ($routeProvider) => {
	$routeProvider
		.when('/', {
			template : '<h1>Main</h1><p>Click on the links to change this content</p>'
		})
		.when('/banana', {
			template : '<h1>Banana</h1><p>Bananas contain around 75% water.</p>'
		})
		.when('/tomato', {
			template : '<h1>Tomato</h1><p>Tomatoes contain around 95% water.</p>'
		});
}]);
