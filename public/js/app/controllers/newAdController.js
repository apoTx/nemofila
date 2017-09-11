app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', ($scope, Upload, $timeout, $http) => {
	// New Ad Form
	$scope.newAdForm = {};

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.preview = false;


	$(() => {
		$('#newAdForm').form();

		$scope.newAdForm.anotherContact =  { };
		$('.ui.checkbox').checkbox({
			onChecked: () => {
				$scope.newAdForm.anotherContact.checked = true;
				setTimeout( () => {
					$('input[name="anotherContactName"]').focus();
				},20);
			},
			onUnchecked: () => {
				$scope.newAdForm.anotherContact.checked = false;
			},
			onChange: () => {
				$scope.$apply();
			}
		});
	});

	$scope.init = (uuid) => {
		if (uuid)
			$scope.getAdBuffer(uuid);
	};

	$scope.getAdBuffer = (uuid) => {
		$scope.loadingBufferData = true;
		$http( {
			url: '/newAd/getAdBuffer/' + uuid,
			method: 'GET',
		}).then( (response) => {
			console.log( response );

			$scope.newAdForm.title = response.data.title;
			$scope.newAdForm.description = response.data.description;

			$scope.loadingBufferData = false;
		}, () => { // optional
			console.log( 'fail' );
		});
	};

	$scope.uploadAndSaveRedis = () => {
		if ($scope.newAdForm.files){
			$scope.uploadFiles($scope.newAdForm.files);
		}else{
			$scope.saveAdToRedis(null, null);
		}
	};

	$scope.nextLoader = false;
	$scope.uploadFiles = (files) => {
		$scope.nextLoader = true;
		if (files && files.length) {
			Upload.upload({
				url: 'newAd/uploadPhotos/'+ $scope.newAdForm.showcaseIndex,
				method: 'POST',
				file: files,
			}).then((response) => {
				$timeout(() => {
					$scope.result = response.data;
					if (response.data.status === 1){
						$scope.saveAdToRedis(response.data.uuid, response.data.photos);
					}
				});
			}, (response) => {
				if (response.status > 0) {
					$scope.errorMsg = response.status + ': ' + response.data;
				}
			}, (evt) => {
				$scope.progress =
					Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		}
	};


	$scope.saveAdToRedis = (uuid, photos) => {
		$scope.newAdBtnLoading = true;

		/* eslint-disable */
		var data;
		/* eslint-enable */
		if (uuid !== null){
			data = 	{ 'data':$scope.newAdForm, 'uuid': uuid, 'photos':photos };
		}else {
			data = { 'data':$scope.newAdForm };
		}

		$http({
			url: '/newAd/saveAdRedis',
			method: 'POST',
			data: data
		}).then((response) => {
			$scope.newAdBtnLoading = false;
			if (response.data.status === 1) {
				completeSaveAd();
			}
		}, () => { // optional
			console.log('fail');
		});
	};


	$scope.newAdForm.showcaseIndex = 0;
	$scope.onPhotoSelect = () => {
		if ($scope.newAdForm.files.length > 0)
			$scope.newAdForm.files[$scope.newAdForm.showcaseIndex].showcase = true;
	};

	$scope.onDeletePhoto = (index) => {
		$scope.newAdForm.files.splice(index, 1);
		if ($scope.newAdForm.files.length > 0){
			$scope.newAdForm.files[0].showcase = true;
			$scope.newAdForm.showcaseIndex = 0;
		}
	};

	$scope.onSelectShowCase = (index) => {
		$scope.newAdForm.files[$scope.newAdForm.showcaseIndex].showcase = false;

		$scope.newAdForm.showcaseIndex = index;
		$scope.newAdForm.files[index].showcase = true;
	};

	$scope.triggerUploadWindow = () => {
		$('input[type=file]').trigger('click');
	};

	let completeSaveAd = () => {
		$scope.openSignInModal();
		previewTab();
		$scope.nextLoader = false;
	};

	let previewTab = () => {
		$scope.steps.informations = false;
		$scope.steps.preview = true;
	};

}]);
