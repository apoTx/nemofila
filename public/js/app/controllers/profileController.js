app.controller('profileController', ['$scope', ($scope) => {
	$scope.init = (amazon_base_url, profile_locales) => {
		$scope.amazon_base_url = amazon_base_url;

		let profile_locale = JSON.parse(profile_locales);

		$scope.i18n_myAdsTitle = profile_locale.myAds.title;
		$scope.i18n_no_results = profile_locale.myAds.no_results;
		$scope.i18n_settings = profile_locale.myAds.settings;
		$scope.i18n_edit = profile_locale.myAds.edit;
		$scope.i18n_buy_power = profile_locale.myAds.buy_power;
		$scope.i18n_unpublish = profile_locale.myAds.unpublish;

		$scope.i18n_messagesTitle = profile_locale.messages.title;
		$scope.i18n_searchPlaceholder = profile_locale.messages.search;
	};
}]);

app.config(['$routeProvider', ($routeProvider) => {
	$routeProvider
		.when('/myads', {
			templateUrl : 'partials/profile/myads.jade',
			controller: 'myAdsController',
		})
		.when('/buypower/:id', {
			templateUrl : 'partials/profile/buyPower.jade',
			controller: 'buyPowerController',
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
