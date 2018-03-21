/*eslint-disable */
app.controller('profileEditController', ['$scope', 'Upload', '$timeout', 'profileEditFactory', 'config', ($scope, Upload, $timeout, profileEditFactory, config) => {
/*eslint-enable */

	$scope.openUploadProfilePictureModal = () => {
		$('#uploadProfilePictureModal').modal('show');
	};

	$scope.onPhotoSelect = () => {
		$scope.openUploadProfilePictureModal();
	};

	$scope.upload = (dataUrl, name) => {
		profileEditFactory.get_s3_signature().then(data => {
			const inputs = data.inputs;

			uploadStart(dataUrl, name, inputs);
		});
	};

	function uploadStart (dataUrl, name, inputs){
		console.log(inputs['policy']);
		Upload.upload({
			url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
			data: {
				file: Upload.dataUrltoBlob(dataUrl, name)
			},
		}).then((response) => {
			$timeout(() => {
				$scope.result = response.data;
			});
		}, (response) => {
			if (response.status > 0) $scope.errorMsg = response.status
				+ ': ' + response.data;
		}, (evt) => {
			$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
		});
	};

}]);
