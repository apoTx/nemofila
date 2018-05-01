app.controller('generalController', ['$scope', 'Upload', 'config', '$timeout',  ($scope, Upload, config, $timeout) => {

	$scope.uploading = false;
	$scope.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		$scope.errFile = errFiles && errFiles[0];
		if (file) {
			file.upload = Upload.upload({
				url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
				data: { file: file }
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
