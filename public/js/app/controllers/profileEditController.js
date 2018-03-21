/*eslint-disable */
app.controller('profileEditController', ['$scope', 'Upload', '$timeout', ($scope, Upload, $timeout) => {
/*eslint-enable */

	$scope.openUploadProfilePictureModal = () => {
		$('#uploadProfilePictureModal').modal('show');
	};

	$scope.onPhotoSelect = () => {
		$scope.openUploadProfilePictureModal();
	};

}]);
