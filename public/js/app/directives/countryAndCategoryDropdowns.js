app.directive('countryAndCategoryDropdowns', () => {
	return {
		template :
		'<div class="clearfix"></div>' +
		'<div class="field">\n' +
		'  <label>Category</label>\n' +
		'  <select name="category" ng-model="newAdForm.category" ng-options="index as category.name for (index, category) in categories " ng-change="changeCategory()">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'  <input ng-hide="true", ng-cloak, ng-model="categories[newAdForm.category].name" name="categoryName" /> ' +
		'  <input ng-hide="true", ng-cloak, ng-model="categories[newAdForm.category]._id" name="categoryId" /> ' +
		'</div>\n' +
		'<div class="field">\n' +
		'  <label>Child Category</label>\n' +
		'  <select name="subCategory" ng-disabled="visiblesCategories.subCategory" ng-model="newAdForm.categoryChild" ng-options="index as subCategory.name for (index, subCategory) in categories[newAdForm.category].subCategories">' +
		'	<option value="">Please select</option>' +
		'</select>\n' +
		'  <input ng-hide="true", ng-cloak, ng-model="categories[newAdForm.category].subCategories[newAdForm.categoryChild].name" name="subCategoryName" /> ' +
		'  <input ng-hide="true", ng-cloak, ng-model="categories[newAdForm.category].subCategories[newAdForm.categoryChild]._id" name="subCategoryId" /> ' +
		'</div>',

		link: function($scope) {
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
