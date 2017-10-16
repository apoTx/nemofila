app.controller('profileController', ['$scope', '$http',  ($scope, $http) => {
	$scope,$http;
}]);

app.config(['$routeProvider', ($routeProvider) => {
	$routeProvider
		.when('/myads', {
			templateUrl : 'partials/profile/myads.jade',
			controller: 'myAdsController',
		})
		.when('/messages/:id?', {
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
}]).run(['$rootScope', '$location', function($rootScope, $location){
	let path = function() { return $location.path();};
	$rootScope.$watch(path, (newVal) => {
		$rootScope.activetab = newVal.split('/')[1];
	});
}]);
