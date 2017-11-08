app.controller('indexController',  ['$scope', '$http', 'indexFactory', 'countriesFactory', 'categoriesFactory', ($scope, $http, indexFactory, countriesFactory, categoriesFactory) => {

	$scope.toggleFilterSidebar = () => {
		$('.filterSidebar')
			.sidebar('setting', 'transition', 'overlay')
			.sidebar('toggle');
	};

	$scope.newAdForm = {};

	$scope.init = (page) => {
		$scope.indexAdsLoading = true;
		$scope.advancedSearchVisible = false;

		indexFactory.getIndexAds(page).then((response) => {
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
	$scope.isSearch = false;
	$scope.resultNumber = 0;
	$scope.onSubmit = (toggleSidebar) => {
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
			$scope.isSearch = true;
			$scope.resultNumber = response.length;
			if (toggleSidebar)
				$scope.toggleFilterSidebar();
		});
	};

	$scope.advancedSearch = () => {
		if (!$scope.advancedSearchVisible){
			$scope.advancedSearchVisible = true;
		}else{
			$scope.advancedSearchVisible = false;
		}
	};
}]);
