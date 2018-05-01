app.controller('generalController', ['$scope', 'Upload', 'config', '$timeout', 'generalFactory',  ($scope, Upload, config, $timeout, generalFactory) => {

	$scope.headerImage = config.s3_photo_base + '/' + config.s3_bucket + '/header.jpg';

	$scope.getUploadCredentials = (file, errFiles) => {
		generalFactory.get_s3_signature().then(data => {
			$scope.uploadFiles(file, errFiles, data.inputs);
		});
	};

	$scope.uploading = false;
	$scope.uploadFiles = function(file, errFiles, inputs) {
		$scope.f = file;
		$scope.errFile = errFiles && errFiles[0];
		if (file) {
			file.upload = Upload.upload({
				url: config.s3_upload_url,
				method: 'POST',
				data: {
					key: 'header.jpg', // the key to store the file on S3, could be file name or customized
					acl: inputs.acl, // sets the access to the uploaded file in the bucket: private, public-read, ...
					policy: inputs.policy, // base64-encoded json policy (see article below)
					'X-amz-signature': inputs['X_amz_signature'], // base64-encoded signature based on policy string (see article below)
					'X-amz-credential': inputs['x_amz_credential'],
					'X-amz-algorithm': inputs['X_amz_algorithm'],
					'X-amz-date': inputs['X_amz_date'],
					'Content-Type': file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
					filename: 'header.jpg', // this is needed for Flash polyfill IE8-9
					file: file,
				}
			});

			file.upload.then((response) => {
				$timeout(() => {
					file.result = response.data;
				});
			}, (response) => {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}, (evt) => {
				file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
			});
		}
	};

}]);
