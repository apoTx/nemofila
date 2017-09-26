app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', ($scope, Upload, $timeout, $http) => {
	// New Ad Form
	$scope.newAdForm = {};
	$scope.newAdForm.anotherContact =  { };

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.preview = false;


	$(() => {
		$('#newAdForm').form();

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
		if (uuid !== 'false'){
			$scope.getAdBuffer(uuid);
		}

		$scope.countries = {};
		$http({
			url: '/countries/getCountries',
			method: 'GET',
		}).then((response) => {
			$scope.countries = response.data;

		}, () => { // optional
			console.log('fail');
		});

		$scope.categories = {};
		$http({
			url: '/categories/getCategories',
			method: 'GET',
		}).then((response) => {
			$scope.categories = response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	let uploadedFiles = [];
	$scope.getAdBuffer = (uuid) => {
		$scope.loadingBufferData = true;
		$http( {
			url: '/newAd/getAdBuffer/' + uuid,
			method: 'GET',
		}).then( (response) => {

			$scope.newAdForm.title = response.data.title || '';
			$scope.newAdForm.description = response.data.description || '';
			$scope.newAdForm.price = response.data.price || '';
			$scope.newAdForm.anotherContact = JSON.parse(response.data.anotherContact);

			try{
				$scope.newAdForm.files = JSON.parse(response.data.photos) || '';
				uploadedFiles = $scope.newAdForm.files;
			}catch (e){
				$scope.newAdForm.files = {};
			}

			let country = JSON.parse(response.data.country);
			$scope.newAdForm.country = country.country.index;
			$scope.newAdForm.city = country.city.index;
			$scope.newAdForm.district = country.district.index;

			$scope.loadingBufferData = false;
		}, () => { // optional
			console.log( 'fail' );
			$scope.loadingBufferData = false;
		});
	};

	$scope.uploadAndSaveRedis = () => {
		if ($scope.newAdForm.files && $scope.newAdForm.files.length  > 0 ){
			$scope.uploadFiles($scope.newAdForm.files, true);
		}else{
			$scope.saveAdToRedis(null, null);
		}
	};

	$scope.uploadAndSaveMongo = (uuid) => {
		if ($scope.newAdForm.files && $scope.newAdForm.files.length  > 0 ){
			$scope.uploadFiles($scope.newAdForm.files, false, uuid);
		}else{
			$scope.onSubmitAd(null, null);
		}
	};

	$scope.nextLoader = false;
	$scope.uploading = false;

	$scope.uploadFiles = (files, saveRedis, uuid) => {
		$scope.nextLoader = true;
		$scope.uploading = true;
		if (files && files.length) {
			Upload.upload({
				url: 'newAd/uploadPhotos/'+ $scope.newAdForm.showcaseIndex +'/'+ uuid,
				method: 'POST',
				file: files,
			}).then((response) => {
				$scope.result = response.data;
				$scope.uploading = false;
				if (response.data.status === 1 ){
					if (saveRedis){
						$scope.saveAdToRedis(response.data.uuid, response.data.photos);
					}else{ // mongo
						$scope.onSubmitAd(response.data.uuid, response.data.photos );
					}
				}
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
			data: {
				data: data,
				country: {
					country: {
						id: $scope.countries[$scope.newAdForm.country]._id,
						index: $scope.newAdForm.country
					},
					city: {
						id: $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city]._id,
						index: $scope.newAdForm.city
					},
					district: {
						id: $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts[$scope.newAdForm.district]._id,
						index: $scope.newAdForm.district
					}
				},
				category: {
					categoryId: $scope.categories[$scope.newAdForm.category]._id,
					childCategoryId: $scope.categories[$scope.newAdForm.category].subCategories[$scope.newAdForm.categoryChild]._id
				}
			}
		}).then((response) => {
			$scope.newAdBtnLoading = false;
			if (response.data.status === 1) {
				completeSaveAd();
			}
		}, () => { // optional
			console.log('fail');
		});
	};

	$scope.adSaveComplete = false;
	$scope.submitBtnLoading = false;
	$scope.onSubmitAd = (uuid, photos) => {
		$scope.submitBtnLoading = true;

		let data = Object.assign({}, $scope.newAdForm);
		delete data.files;

		let photoList = photos ? photos.concat(uploadedFiles) : null;

		$http({
			url: '/newAd/create',
			method: 'POST',
			data: {
				data: data,
				photos: photoList,
				uuid: uuid,
				showcaseIndex: $scope.newAdForm.showcaseIndex,
				country: {
					countryId: $scope.countries[$scope.newAdForm.country]._id,
					cityId: $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city]._id,
					districtId: $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts[$scope.newAdForm.district]._id
				},
				category: {
					categoryId: $scope.categories[$scope.newAdForm.category]._id,
					childCategoryId: $scope.categories[$scope.newAdForm.category].subCategories[$scope.newAdForm.categoryChild]._id
				}
			}
		}).then((response) => {
			$scope.submitBtnLoading = false;

			if(response.data.status === 1){
				$scope.adSaveComplete = true;
			}
		}, () => { // optional
			$scope.submitBtnLoading = false;
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
		$('input[type="file"]').trigger('click');
	};

	let completeSaveAd = () => {
		$scope.openSignInModal();
		$scope.previewTab();
		$scope.nextLoader = false;
	};

	$scope.previewTab = () => {
		$scope.steps.informations = false;
		$scope.steps.preview = true;
	};

	$scope.adInformationTab = () => {
		$scope.steps.informations = true;
		$scope.steps.preview = false;
	};

	// Select option Countries
	$scope.visiblesCountries = {
		cities: true,
		districts: true
	};
	$scope.changeCountry = () => {
		$scope.visiblesCountries.cities = false;
	};
	$scope.changeCity= () => {
		$scope.visiblesCountries.districts = false;
	};

	// Select option Categories
	$scope.visiblesCategories = {
		subCategory: true,
	};
	$scope.changeCategory = () => {
		$scope.visiblesCategories.subCategory = false;
	};
}]);
