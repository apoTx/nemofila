app.controller('profileController', ['$scope', '$http',  ($scope, $http) => {
	$scope,$http;
}]);

app.config(['$routeProvider', ($routeProvider) => {
	$routeProvider
		.when('/myads', {
			templateUrl : 'partials/profile/myads.jade',
			controller: 'myAdsController',
		})
		.when('/messages', {
			templateUrl : 'partials/profile/messages.jade',
			controller: 'messagesController'
		})
		.when('/myfavourites', {
			templateUrl : 'partials/profile/myFavourites.jade',
			controller: 'myFavouritesController'
		})
		.otherwise({
			redirectTo: '/myads'
		});
}]);
