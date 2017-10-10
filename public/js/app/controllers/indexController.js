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
			location.countryId = $scope.countries[$scope.newAdForm.country]._id;
		}catch (e){
			location.countryId = null;
		}

		try{
			location.cityId = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city]._id;
		}catch (e){
			location.cityId = null;
		}

		try{
			location.districtId = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts[$scope.newAdForm.district]._id;
		}catch (e){
			location.districtId = null;
		}

		let category =  { };
		try{
			category.categoryId = $scope.categories[$scope.newAdForm.category]._id;
		}catch (e){
			category.categoryId = null;
		}

		try{
			category.categoryChildId = $scope.categories[$scope.newAdForm.category].subCategories[$scope.newAdForm.categoryChild]._id;
		}catch (e){
			category.categoryChildId = null;
		}

		indexFactory.searchAd($scope.searchForm.title, location, category).then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response;
		});
	};

	$scope.advancedSearch = () => {
		$scope.advancedSearchVisible = true;
	};
}]);
