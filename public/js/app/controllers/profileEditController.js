/*eslint-disable */
app.controller('profileEditController', ['$scope',  function($scope){
/*eslint-enable */

	$scope.openUploadProfilePictureModal = (closeOther) => {
		if (closeOther){
			$('#uploadProfilePictureModal').modal('show');
		}
		$('#uploadProfilePictureModal').modal('show');
	};

	$scope.openUploadProfilePictureModal();

}]);
