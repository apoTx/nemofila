app.controller('newAdController', ['$scope', 'Upload', '$timeout', ($scope, Upload, $timeout) => {
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

	$scope.uploadFiles = function (files) {
		$scope.files = files;
		if (files && files.length) {
			Upload.upload({
				url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
				data: {
					files: files
				}
			}).then((response) => {
				$timeout(() => {
					$scope.result = response.data;
				});
			}, (response) => {
				if (response.status > 0) {
					$scope.errorMsg = response.status + ': ' + response.data;
				}
			}, (evt) => {
				$scope.progress =
					Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		}
	};

}]);