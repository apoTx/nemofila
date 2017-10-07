app.controller('indexController',  ['$scope', '$http', 'indexFactory', 'countriesFactory', 'categoriesFactory', ($scope, $http, indexFactory, countriesFactory, categoriesFactory) => {

	$scope.newAdForm = {};

	$scope.init = () => {
		$scope.indexAdsLoading = true;
		$scope.advancedSearchVisible = false;

		indexFactory.getIndexAds().then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response;
		});

		countriesFactory.getCountries().then((response) => {
			$scope.countries = response;
			console.log($scope.countries);
		});

		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
		});
	};

	$scope.searchForm = { };
	$scope.onSubmit = () => {
		$scope.indexAdsLoading = true;

		let location = { };
		try{
			location.country = $scope.countries[$scope.newAdForm.country]._id;
		}catch (e){
			location.country = -1;
		}

		try{
			location.city = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city]._id;
		}catch (e){
			location.city = -1;
		}

		try{
			location.district = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts[$scope.newAdForm.district]._id;
		}catch (e){
			location.district = -1;
		}

		indexFactory.searchAd($scope.searchForm.title, location).then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response;
		});
	};

	$scope.advancedSearch = () => {
		$scope.advancedSearchVisible = true;
	};
}]);
