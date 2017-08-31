app.controller('newAdController', ['$scope', '$http',  ($scope, $http) => {
	// New Ad Form
	$('.ui.dropdown').dropdown();
	$('#newAdForm').form();

	$scope.anotherContact =  { };
	$('.ui.checkbox').checkbox({
		onChecked: () => {
			$scope.anotherContact.checked = true;
		},
		onUnchecked: () => {
			$scope.anotherContact.checked = false;
		},
		onChange: () => {
			$scope.$apply();
		}
	});

}]);