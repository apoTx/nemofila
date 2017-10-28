app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'countriesFactory', 'categoriesFactory', ($scope, Upload, $timeout, $http, $window, countriesFactory, categoriesFactory) => {
	// New Ad Form
	$scope.newAdForm = {};
	$scope.newAdForm.anotherContact =  { };

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.preview = false;


	$(() => {
		$('#newAdForm').form({
			keyboardShortcuts: false,
			on: 'blur',
			inline : true,
			/*fields: {
				title: {
					identifier  : 'title',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter a title.'
						},
						{
							type   : 'maxLength[100]',
							prompt : 'Your title can be up to {ruleValue} characters long.'
						}
					]
				},
				price: {
					identifier  : 'price',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter a price.'
						},
						{
							type   : 'decimal',
							prompt : 'Please enter a valid price.'
						}
					]
				},
				description: {
					identifier  : 'description',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter a description.'
						},
						{
							type   : 'maxLength[2000]',
							prompt : 'Your description can be up to {ruleValue} characters long.'
						}
					]
				},
				country: {
					identifier: 'country',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a country.'
						}
					]
				},
				city: {
					identifier: 'city',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a city.'
						}
					]
				},
				district: {
					identifier: 'district',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a district.'
						}
					]
				},
				category: {
					identifier: 'category',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a category.'
						}
					]
				},
				subCategory: {
					identifier: 'subCategory',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a sub category.'
						}
					]
				},
			},*/
			onSuccess: () => {
				$scope.next();
			}
		});

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

	$scope.init = (uuid, userExists) => {
		if (uuid !== 'false'){
			$scope.getAdBuffer(uuid);
		}

		$scope.userExists =  (userExists == 'true');

		countriesFactory.getCountries().then((response) => {
			$scope.countries = response;
		});

		categoriesFactory.getCategories().then((response) => {
			$scope.categories = response;
		});
	};

	$scope.next = () => {
		console.log('next');

		if (!$scope.userExists){
			console.log('uploadAndSaveRedis()');
			$scope.uploadAndSaveRedis();
		}else{
			console.log('previewTab()');
			$scope.previewTab();
		}

		$scope.$apply();
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
				$scope.newAdForm.files = [];
			}

			let country = JSON.parse(response.data.country);
			$scope.newAdForm.country = country.country.index;
			$scope.newAdForm.city = country.city.index;
			$scope.newAdForm.district = country.district.index;

			let category = JSON.parse(response.data.category);
			$scope.newAdForm.category = category.category.index;
			$scope.newAdForm.categoryChild = category.childCategory.index;

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

	$scope.uploadFiles = (files, saveRedis/*, uuid*/) => {

		console.log($scope.newAdForm.X_Amz_Signature); // base64-encoded signature based on policy string (see article below)
		console.log($scope.newAdForm.X_Amz_Credential);
		console.log($scope.newAdForm.X_Amz_Algorithm);
		console.log($scope.newAdForm.X_Amz_Date);
		console.log($scope.newAdForm.x_amz_meta_uuid);

		$scope.nextLoader = true;
		$scope.uploading = true;
		if (files && files.length) {
			Upload.upload({
				url: 'https://mehmet-easyad-test.s3-eu-central-1.amazonaws.com',
				method: 'POST',
				data: {
					key: 'deneme', // the key to store the file on S3, could be file name or customized
					acl: $scope.acl, // sets the access to the uploaded file in the bucket: private, public-read, ...
					policy: $scope.policy, // base64-encoded json policy (see article below)
					'X-amz-signature': $scope.X_amz_signature, // base64-encoded signature based on policy string (see article below)
					'X-amz-credential': $scope.x_amz_credential,
					'X-amz-algorithm': $scope.X_amz_algorithm,
					'X-amz-date': $scope.X_amz_date,
					'Content-Type': files[0].type != '' ? files.type : 'application/octet-stream', // content type of the file (NotEmpty)
					filename: files[0].name, // this is needed for Flash polyfill IE8-9
					file: files[0],
				}
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
					category: {
						id: $scope.categories[$scope.newAdForm.category]._id,
						index: $scope.newAdForm.category
					},
					childCategory: {
						id: $scope.categories[$scope.newAdForm.category].subCategories[$scope.newAdForm.categoryChild]._id,
						index: $scope.newAdForm.categoryChild
					}
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

		let index;
		if (photoList !== null)
			index = photoList.findIndex(img => img.showcase === true);
		else
			index = null;

		$http({
			url: '/newAd/create',
			method: 'POST',
			data: {
				data: data,
				photos: photoList,
				uuid: uuid,
				showcaseIndex: index,
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
				$window.scrollTo(0, 0);
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
		if ($scope.newAdForm.showcaseIndex === index){
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

}]);
