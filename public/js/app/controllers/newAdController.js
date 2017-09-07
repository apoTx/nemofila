app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', ($scope, Upload, $timeout, $http) => {
	// New Ad Form

	$scope.name = 'mehmet';

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
		console.log(files);

		$scope.files = files;
		if (files && files.length) {
			Upload.upload({
				url: 'newAd/uploadPhotos',
				method: 'POST',
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


	$scope.newAdForm = {};
	$scope.saveAd = () => {
		$scope.newAdBtnLoading = true;
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
