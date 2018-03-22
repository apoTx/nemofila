app.controller('profileEditsController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'newAdFactory', 'countriesFactory', 'categoriesFactory', 'config', 'Slug', ($scope, Upload, $timeout, $http, $window, newAdFactory, countriesFactory, categoriesFactory, config, Slug) => {

	// New Ad Form
	$scope.newAdForm = {};

	$scope.uploadAndSaveMongo = (id) => {
		if($scope.newAdForm.files && $scope.newAdForm.files.length > 0){
			$scope.uploadFiles($scope.newAdForm.files, id);
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

	$scope.uploadFiles = (files, id) => {
		$scope.uploading = true;
		if (files && files.length) {

			files.forEach((file) => {
				let extensionData = (file.name).split('.');
				let fileExtension = extensionData[extensionData.length - 1];

				let photoName = guid() +'.'+ fileExtension;

				file.upload = Upload.upload({
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
						file: file,
					}
				});

				file.upload.then((response) => {
					$scope.result = response.data;
					$scope.uploading = false;

				}, (response) => {
					if (response.status > 0) {
						$scope.errorMsg = response.status + ': ' + response.data;
					}
				}, (evt) => {
					file.progress = Math.min(100, parseInt(100.0 *
						evt.loaded / evt.total));
				});
			}); // foreach
		}
	};

	$scope.triggerUploadWindow = () => {
		$('input[type="file"]').trigger('click');
	};

}]);



