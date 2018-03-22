app.controller('profileEditsController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'newAdFactory', 'countriesFactory', 'categoriesFactory', 'config', 'Slug', ($scope, Upload, $timeout, $http, $window, newAdFactory, countriesFactory, categoriesFactory, config, Slug) => {

	// New Ad Form
	$scope.newAdForm = {};
	$scope.newAdForm.anotherContact =  { };

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.power = false;
	$scope.steps.preview = false;

	$scope.powerNumber = '0';
	$scope.buyPowerStatus = false;
	$scope.buyPowerLoader = false;

	$scope.newAdForm.place = null;

	$scope.autocompleteOptions = {
		types: ['(cities)']
	};


	$scope.next = () => {
		/*if ( !$scope.isEdit )
			$scope.powerTab();
		else
			$scope.previewTab();
		*/
		$scope.previewTab();
		$scope.$apply();
	};

	$scope.back = () => {
		/*if ( !$scope.isEdit )
			$scope.powerTab();
		else
			$scope.adInformationTab();*/

		$scope.adInformationTab();
	};

	$scope.uploadedFiles = [];
	$scope.getAd = (id, callback) => {
		$scope.loadingBufferData = true;
		$http( {
			url: '/newAd/getEditAd/' + id,
			method: 'GET',
		}).then( (response) => {

			$scope.newAdForm.title = response.data.title || '';
			$scope.newAdForm.description = response.data.description || '';
			$scope.newAdForm.description2 = response.data.description2 || '';
			$scope.newAdForm.phone = response.data.phone || '';
			$scope.newAdForm.mobile_phone = response.data.mobile_phone || '';
			$scope.newAdForm.address = response.data.address || '';
			$scope.newAdForm.website = response.data.website || '';
			$scope.newAdForm.anotherContact = response.data.anotherContact;
			$scope.newAdForm.place = response.data.place;
			$scope.newAdForm.workTimes = response.data.workTimes;

			if (!$scope.newAdForm.anotherContact){
				$scope.newAdForm.anotherContact =  { };
				$scope.newAdForm.anotherContact.checked = false;
			}

			try{
				$scope.newAdForm.files = response.data.photos || '';
				$scope.uploadedFiles = $scope.newAdForm.files;
				$scope.newAdForm.showcaseIndex = response.data.photoShowcaseIndex;
			}catch (e){
				$scope.newAdForm.files = [];
			}

			let category = response.data.category;
			setTimeout(() => {
				$scope.newAdForm.category = (($scope.categories).findIndex(x => String(x._id) === String(category.categoryId))).toString();
				$scope.newAdForm.categoryChild = (($scope.categories[$scope.newAdForm.category].subCategories).findIndex(x => String(x._id) === String(category.categoryChildId))).toString();

				/*$scope.newAdForm.country = (($scope.countries).findIndex(x => String(x._id) === String(country.countryId))).toString();
				$scope.newAdForm.city = (($scope.countries[$scope.newAdForm.country].cities).findIndex(x => String(x._id) === String(country.cityId))).toString();
				$scope.newAdForm.district = (($scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts).findIndex(x => String(x._id) === String(country.districtId))).toString();*/
			});

			$scope.loadingBufferData = false;

			callback();
		}, () => { // optional
			console.log( 'fail' );
			$scope.loadingBufferData = false;
		});
	};

	$scope.uploadAndSaveMongo = (id) => {
		if($scope.newAdForm.files && $scope.newAdForm.files.length > 0){
			$scope.uploadFiles($scope.newAdForm.files, id);
		} else {
			$scope.onSubmitAd( null, id, false );
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


	$scope.newAdForm.showcaseIndex = 0;
	$scope.onPhotoSelect = () => {
		if ($scope.isEdit){
			if ($scope.uploadedFiles < 1)
				$scope.newAdForm.files[0].showcase = true;
		}else{
			if ($scope.newAdForm.files.length > 0)
				$scope.newAdForm.files[$scope.newAdForm.showcaseIndex].showcase = true;
		}
	};

	$scope.triggerUploadWindow = () => {
		$('input[type="file"]').trigger('click');
	};

}]);



