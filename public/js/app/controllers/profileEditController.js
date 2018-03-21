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

			uploadStart(dataUrl, name, inputs['X-amz-signature'], inputs['X-amz-credential'], inputs['X-amz-algorithm'], inputs['X-amz-date']);
		});
	};

	function uploadStart (dataUrl, name, x_amz_signature, x_amz_credential, x_amz_algorithm, x_amz_date){
		console.log('a');
		Upload.upload({
			url: config.s3_upload_url,
			method: 'POST',
			data: {
				key: 'test.jpg', // the key to store the file on S3, could be file name or customized
				acl: $scope.acl, // sets the access to the uploaded file in the bucket: private, public-read, ...
				policy: $scope.policy, // base64-encoded json policy (see article below)
				'X-amz-signature': x_amz_signature, // base64-encoded signature based on policy string (see article below)
				'X-amz-credential': x_amz_credential,
				'X-amz-algorithm': x_amz_algorithm,
				'X-amz-date': x_amz_date,
				filename: 'test.jpg', // this is needed for Flash polyfill IE8-9
				file: Upload.dataUrltoBlob(dataUrl, name),
			}
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
