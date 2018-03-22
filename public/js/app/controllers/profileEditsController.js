app.controller('profileEditsController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'config',  ($scope, Upload, $timeout, $http, $window,  config) => {

	// New Ad Form
	$scope.profilePhotoForm = {};

	$scope.uploadAndSaveMongo = (croppedDataUrl, name) => {
		if($scope.profilePhotoForm.files){
			$scope.uploadFiles(croppedDataUrl, name);
		}
	};

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	$scope.uploading = false;
	$scope.uploadFiles = (file, name) => {
		$scope.uploading = true;
		if (file) {
			let extensionData = name.split('.');
			let fileExtension = extensionData[extensionData.length - 1];

			let photoName = guid() +'.'+ fileExtension;

			Upload.upload({
				url: config.s3_upload_url,
				method: 'POST',
				data: {
					key: photoName, // the key to store the file on S3, could be file name or customized
					acl: $scope.acl, // sets the access to the uploaded file in the bucket: private, public-read, ...
					policy: $scope.policy, // base64-encoded json policy (see article below)
					'X-amz-signature': $scope.X_amz_signature, // base64-encoded signature based on policy string (see article below)
					'X-amz-credential': $scope.x_amz_credential,
					'X-amz-algorithm': $scope.X_amz_algorithm,
					'X-amz-date': $scope.X_amz_date,
					'Content-Type': file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
					filename: photoName, // this is needed for Flash polyfill IE8-9
					file: Upload.dataUrltoBlob(file, photoName),
				}
			}).then((response) => {
				$scope.result = response.data;
				$scope.uploading = false;
				console.log(response);

			}, (response) => {
				if (response.status > 0) {
					$scope.errorMsg = response.status + ': ' + response.data;
				}
			}, (evt) => {
				$scope.progress = Math.min(100, parseInt(100.0 *
					evt.loaded / evt.total));
			});
		}
	};

	$scope.triggerUploadWindow = () => {
		$('input[type="file"]').trigger('click');
	};

	$scope.openUploadProfilePictureModal = () => {
		$('#uploadProfilePictureModal').modal('show');
	};

}]);



