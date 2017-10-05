app.controller('indexController',  ['$scope', '$http', 'indexFactory', 'countriesFactory', 'categoriesFactory', ($scope, $http, indexFactory, countriesFactory, categoriesFactory) => {

	$scope.init = () => {
		$scope.indexAdsLoading = true;
		$scope.advancedSearchVisible = false;

		indexFactory.getIndexAds().then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response;
		});

		countriesFactory.getCountries().then((response) => {
			$scope.countries = response;
		});

		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
		});
	};

	$scope.searchForm = { };
	$scope.onSubmit = () => {
		$scope.indexAdsLoading = true;

		indexFactory.searchAd($scope.searchForm.title).then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response;
		});
	};

	$scope.advancedSearch = () => {
		$scope.advancedSearchVisible = true;
	};
}]);
