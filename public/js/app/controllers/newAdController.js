app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', ($scope, Upload, $timeout, $http) => {
	// New Ad Form
	$scope.newAdForm = {};

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.preview = false;

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

	$scope.newAdForm.uploadedFiles = {};
	$scope.uploadFiles = function (files) {
		if (files && files.length) {
			Upload.upload({
				url: 'newAd/uploadPhotos',
				method: 'POST',
				data: {
					files: $scope.newAdForm.files
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


	$scope.saveAd = () => {
		$scope.openSignInModal();
		$scope.newAdBtnLoading = true;
		$scope.steps.informations = false;
		$scope.steps.preview = true;

		$http({
			url: '/newAd/saveAdBuffer',
			method: 'POST',
			data: { 'data' : $scope.newAdForm }
		}).then((response) => {
			console.log(response);
			$scope.newAdBtnLoading = false;

		}, () => { // optional
			console.log('fail');
		});
	};

}]);
