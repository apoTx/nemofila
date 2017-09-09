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
	$scope.uploadFiles = function (files, uuid) {
		if (files && files.length) {
			Upload.upload({
				url: 'newAd/uploadPhotos/'+ uuid,
				method: 'POST',
				file: files,
				data: { veri: 1 },
			}).then((response) => {
				$timeout(() => {
					$scope.result = response.data;
					if (response.data.status == 1){
						// $scope.openSignInModal();
						$scope.steps.informations = false;
						$scope.steps.preview = true;
					}
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
		$scope.newAdBtnLoading = true;
		$http({
			url: '/newAd/saveAdBuffer',
			method: 'POST',
			data: { 'data' : $scope.newAdForm }
		}).then((response) => {
			$scope.newAdBtnLoading = false;
			console.log(response);
			if (response.data.status == 1){
				$scope.uploadFiles($scope.newAdForm.files, response.data.uuid);
			}
		}, () => { // optional
			console.log('fail');
		});
	};

}]);
