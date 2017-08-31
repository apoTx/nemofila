app.controller('newAdController', ['$scope', ($scope) => {
	// New Ad Form
	$('.ui.dropdown').dropdown();
	$('#newAdForm').form();

	$scope.anotherContact =  { };
	$('.ui.checkbox').checkbox({
		onChecked: () => {
			$scope.anotherContact.checked = true;
			setTimeout( () => {
				$('input[name="anotherContactName"]').focus();
			},20);
		},
		onUnchecked: () => {
			$scope.anotherContact.checked = false;
		},
		onChange: () => {
			$scope.$apply();
		}
	});
}]);