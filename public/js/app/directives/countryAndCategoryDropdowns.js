app.directive('countryAndCategoryDropdowns', () => {
	return {
		template :
		'<div class="field">\n' +
		'  <label>Category</label>\n' +
		'  <select name="category" ng-model="newAdForm.category" ng-options="index as category.name for (index, category) in categories" ng-change="changeCategory()">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>\n' +
		'<div class="field">\n' +
		'  <label>Child Category</label>\n' +
		'  <select name="subCategory" ng-disabled="visiblesCategories.subCategory" ng-model="newAdForm.categoryChild" ng-options="index as subCategory.name for (index, subCategory) in categories[newAdForm.category].subCategories">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>',


		link: function($scope) {
			// Select option Countries
			$scope.visiblesCountries = {
				cities: true,
				districts: true
			};
			$scope.changeCountry = () => {
				$scope.visiblesCountries.cities = false;
			};
			$scope.changeCity= () => {
				$scope.visiblesCountries.districts = false;
			};

			// Select option Categories
			$scope.visiblesCategories = {
				subCategory: true,
			};
			$scope.changeCategory = () => {
				$scope.visiblesCategories.subCategory = false;
			};
		}

	};
});
