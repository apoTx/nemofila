app.controller('profileEditController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'config', 'profileEditFactory', 'guidFactory', ($scope, Upload, $timeout, $http, $window, config, profileEditFactory, guidFactory) => {

	// New Ad Form
	$scope.profilePhotoForm = {};
	$scope.file = '';

	$scope.init = (photo) => {
		$scope.profilePhotoForm.photo = photo;
	};

	$scope.uploadAndSaveMongo = (croppedDataUrl, name) => {
		profileEditFactory.get_s3_signature().then(data => {
			$scope.uploadFiles(croppedDataUrl, name, data.inputs);
		});
	};

	$scope.uploading = false;
	$scope.uploadFiles = (file, name, inputs) => {
		$scope.uploading = true;
		if (file) {
			let extensionData = name.split('.');
			let fileExtension = extensionData[extensionData.length - 1];

			let photoName = guidFactory.generateGuid() +'.'+ fileExtension;

			Upload.upload({
				url: config.s3_upload_url,
				method: 'POST',
				data: {
					key: photoName, // the key to store the file on S3, could be file name or customized
					acl: inputs.acl, // sets the access to the uploaded file in the bucket: private, public-read, ...
					policy: inputs.policy, // base64-encoded json policy (see article below)
					'X-amz-signature': inputs['X_amz_signature'], // base64-encoded signature based on policy string (see article below)
					'X-amz-credential': inputs['x_amz_credential'],
					'X-amz-algorithm': inputs['X_amz_algorithm'],
					'X-amz-date': inputs['X_amz_date'],
					'Content-Type': file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
					filename: photoName, // this is needed for Flash polyfill IE8-9
					file: Upload.dataUrltoBlob(file, photoName),
				}
			}).then((response) => {
				$scope.result = response.data;
				$scope.uploading = false;

				profileEditFactory.updatePhotoUrl(photoName).then((user) => {
					$scope.profilePhotoForm.photo = user.profilePictureUrl;
					$scope.profilePhotoForm.files = [];
					$scope.closeUploadProfilePictureModal();
				});

			}, (response) => {
				if (response.status > 0) {
					$scope.errorMsg = response.status + ': ' + response.data;
				}
			}, (evt) => {
				$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
			});
		}
	};

	$scope.openUploadProfilePictureModal = () => {
		$('#uploadProfilePictureModal').modal('show');
	};

	$scope.closeUploadProfilePictureModal = () => {
		$('#uploadProfilePictureModal').modal('hide');
	};

}]);



