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
			url: 'https://easyad-static.s3-eu-central-1.amazonaws.com',
			method: 'POST',
			data: {
				key: name, // the key to store the file on S3, could be file name or customized
				acl: inputs['acl'], // sets the access to the uploaded file in the bucket: private, public-read, ...
				policy: inputs['policy'], // base64-encoded json policy (see article below)
				'X-amz-signature': inputs['X-amz-signature'], // base64-encoded signature based on policy string (see article below)
				'X-amz-credential': inputs['X-amz-credential'],
				'X-amz-algorithm': inputs['X-amz-algorithm'],
				'X-amz-date': inputs['X-amz-date'],
				'Content-Type': '', // content type of the file (NotEmpty)
				filename: name, // this is needed for Flash polyfill IE8-9
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
	}

}]);
