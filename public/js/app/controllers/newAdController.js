app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', ($scope, Upload, $timeout, $http) => {
	// New Ad Form
	$scope.newAdForm = {};

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.preview = false;


	$(() => {
		$('#newAdForm').form();

		$scope.newAdForm.anotherContact =  { };
		$('.ui.checkbox').checkbox({
			onChecked: () => {
				$scope.newAdForm.anotherContact.checked = true;
				setTimeout( () => {
					$('input[name="anotherContactName"]').focus();
				},20);
			},
			onUnchecked: () => {
				$scope.newAdForm.anotherContact.checked = false;
			},
			onChange: () => {
				$scope.$apply();
			}
		});
	});


	$scope.uploadFiles = function (files, uuid, callback) {
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
						callback();
					}
				});
			}, (response) => {
				if (response.status > 0) {
					$scope.errorMsg = response.status + ': ' + response.data;
					callback($scope.errorMsg);
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

			if (response.data.status == 1){
				if ($scope.newAdForm.files){
					$scope.uploadFiles($scope.newAdForm.files, response.data.uuid,  (err) => {
						if (err){
							throw err;
						}else{
							completeSaveAd();
						}
					});
				}else{
					completeSaveAd();
				}
			}
		}, () => { // optional
			console.log('fail');
		});
	};


	let completeSaveAd = () => {
		// $scope.openSignInModal();
		$scope.steps.informations = false;
		$scope.steps.preview = true;
	};

}]);
