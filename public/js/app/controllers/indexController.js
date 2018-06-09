app.controller('indexController',  ['$scope', '$http', 'indexFactory',  'categoriesFactory', ($scope, $http, indexFactory,  categoriesFactory) => {

	$scope.containers = [{
		id: 1,
		name: 'Box1'
	}, {
		id: 2,
		name: 'Box2'
	}, {
		id: 3,
		name: 'Box3'
	}];

	$scope.select = function(category) {
		$scope.visiblesCategories.subCategory = false;
		$scope.categoryIndex = $scope.categories.findIndex(x => x._id ===  category._id);
		console.log("index", $scope.categoryIndex);
		$scope.newAdForm.category = $scope.categoryIndex;
	};



	$scope.visiblesCategories = {
		subCategory: true,
	};

	$scope.changeCategory = () => {
		$scope.visiblesCategories.subCategory = false;

	};


	$(() => {
		setTimeout(() => {
			$('.rating').rating({
				maxRating: 5,
				interactive: false
			});
		}, 400);
	});

	$scope.toggleFilterSidebar = () => {
		$('.filterSidebar')
			.sidebar('setting', 'transition', 'overlay')
			.sidebar('toggle');
	};

	$scope.newAdForm = {};
	$scope.place = null;

	$scope.init = (page) => {
		$('.dropdown').dropdown();

		$scope.indexAdsLoading = true;
		$scope.indexEventsLoading = true;
		$scope.advancedSearchVisible = false;

		indexFactory.getIndexAds(page).then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response.data;
			$scope.adPerPage = response.adPerPage;
			$scope.adCount = response.adCount;
			$scope.currentPage = response.page;
			$scope.dayName = response.dayName;
			$scope.currentTime = response.currentTime;
		});

		indexFactory.getIndexEvents().then((response) => {
			$scope.indexEventsLoading = false;
			$scope.events = response;
		});

		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
			console.log($scope.categories);
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
			$scope.ads = response.data;
			$scope.isSearch = true;
			$scope.resultNumber = response.data.length;
			$scope.adPerPage = response.adPerPage;
			$scope.adCount = response.adCount;
			$scope.currentPage = response.page;
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


	$scope.openHowItWorkModal = () => {
		$('#howItWorkModal').modal('show');
	};

}]);
