app.controller('newEventController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'eventFactory', 'categoriesFactory', ($scope, Upload, $timeout, $http, $window, eventFactory, categoriesFactory) => {

	// New Event Form
	$scope.newEventForm = {};

	$scope.steps = {};
	$scope.steps.informations = true;
	$scope.steps.preview = false;

	$scope.newEventForm.place = null;

	$(() => {

		const dateFormat = {
			date:  (date) => {
				if (!date) return '';
				const day = date.getDate();
				const month = date.getMonth() + 1;
				const year = date.getFullYear();
				return day + '/' + month + '/' + year;
			}
		};

		const today = new Date();
		const startDateRange = {
			minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60)
		};

		const endDateRange = {
			maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30),
		};

		$('#startDate').calendar({
			type: 'date',
			onChange: (date,text) => {
				$scope.newEventForm.startDate = date;
				$scope.newEventForm.startDateText = text;
				$scope.$apply();
				console.log($scope.newEventForm.startDate);
				console.log($scope.newEventForm.startDate - 30);
			},
			formatter: {
				date: dateFormat.date
			},
			minDate: startDateRange.minDate,
			maxDate: startDateRange.maxDate,
			endCalendar: $('#endDate')
		});

		$('#endDate').calendar({
			type: 'date',
			onChange: (date,text) => {
				$scope.newEventForm.endDate = date;
				$scope.newEventForm.endDateText = text;
			},
			formatter: {
				date: dateFormat.date
			},
			maxDate: endDateRange.maxDate,
			startCalendar: $('#startDate')
		});


		$('#newEventForm').form({
			keyboardShortcuts: false,
			on: 'blur',
			inline : true,
			fields: {
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
				category: {
					identifier: 'category',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a category.'
						}
					]
				},
				startDate: {
					identifier: 'startDate',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a start date.'
						}
					]
				},
				endDate: {
					identifier: 'endDate',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a end date.'
						}
					]
				}
			},
			onSuccess: () => {
				$scope.next();
			}
		});
	});

	$scope.init = (id) => {
		$scope.loadingAd = true;
		eventFactory.getAd(id).then((data) => {
			$scope.loadingAd = false;
			$scope.ad = data;
		});

		categoriesFactory.getEventCategories().then((data) => {
			$scope.eventCategories = data;
		});
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
		$scope.adInformationTab();
	};

	$scope.uploadedFiles = [];
	$scope.getAd = (id) => {
		$scope.loadingBufferData = true;
		$http( {
			url: '/newAd/getEditAd/' + id,
			method: 'GET',
		}).then( (response) => {

			$scope.newEventForm.title = response.data.title || '';
			$scope.newEventForm.description = response.data.description || '';
			$scope.newEventForm.phone = response.data.phone || '';
			$scope.newEventForm.mobile_phone = response.data.mobile_phone || '';
			$scope.newEventForm.address = response.data.address || '';
			$scope.newEventForm.website = response.data.website || '';
			$scope.newEventForm.anotherContact = response.data.anotherContact;
			if (!$scope.newEventForm.anotherContact){
				$scope.newEventForm.anotherContact =  { };
				$scope.newEventForm.anotherContact.checked = false;
			}

			try{
				$scope.newEventForm.files = response.data.photos || '';
				$scope.uploadedFiles = $scope.newEventForm.files;
				$scope.newEventForm.showcaseIndex = response.data.photoShowcaseIndex;
			}catch (e){
				$scope.newEventForm.files = [];
			}

			let country = response.data.location;
			let category = response.data.category;
			setTimeout(() => {
				$scope.newEventForm.category = (($scope.categories).findIndex(x => String(x._id) === String(category.categoryId))).toString();
				$scope.newEventForm.categoryChild = (($scope.categories[$scope.newEventForm.category].subCategories).findIndex(x => String(x._id) === String(category.categoryChildId))).toString();

				$scope.newEventForm.country = (($scope.countries).findIndex(x => String(x._id) === String(country.countryId))).toString();
				$scope.newEventForm.city = (($scope.countries[$scope.newEventForm.country].cities).findIndex(x => String(x._id) === String(country.cityId))).toString();
				$scope.newEventForm.district = (($scope.countries[$scope.newEventForm.country].cities[$scope.newEventForm.city].districts).findIndex(x => String(x._id) === String(country.districtId))).toString();
			});

			$scope.loadingBufferData = false;
		}, () => { // optional
			console.log( 'fail' );
			$scope.loadingBufferData = false;
		});
	};

	$scope.uploadAndSaveMongo = (id) => {
		if($scope.newEventForm.files && $scope.newEventForm.files.length > 0){
			$scope.uploadFiles($scope.newEventForm.files, id);
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

	$scope.nextLoader = false;
	$scope.uploading = false;
	$scope.photos = [];
	let oldPhotos = 0;

	$scope.uploadFiles = (files, id) => {
		$scope.nextLoader = true;
		$scope.uploading = true;
		if (files && files.length) {
			let itemsProcessed = 0;
			let totalNewFiles = files.filter((x) => { return x.name; }).length;

			if (totalNewFiles < 1){
				$scope.uploading = false;
				$scope.onSubmitAd( files, id, false );
			}

			files.forEach((file) => {
				let photoName = guid() +'_'+file.name;

				if (!file.name) {
					oldPhotos++;
					return true;
				}

				file.upload = Upload.upload({
					url: 'https://easyad-static.s3-eu-central-1.amazonaws.com',
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
						filename: file.name, // this is needed for Flash polyfill IE8-9
						file: file,
					}
				});

				file.upload.then((response) => {
					$scope.result = response.data;
					file.progressFinish = true;

					itemsProcessed++;

					if (file.showcase)
						$scope.photos.push({ filename: photoName, showcase: true });
					else
						$scope.photos.push({ filename: photoName });

					if(itemsProcessed + oldPhotos === files.length) {
						$scope.uploading = false;
						$scope.onSubmitAd( $scope.photos, id );
					}
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

	$scope.eventSaveComplete = false;
	$scope.submitBtnLoading = false;
	$scope.onSubmitAd = (photos, id, newPhotos) => {
		$scope.submitBtnLoading = true;

		let data = Object.assign({}, $scope.newEventForm);

		delete data.files;

		let photoList;
		if (newPhotos === false){
			photoList = photos;
		}else{
			if($scope.uploadedFiles){
				console.log('test');
				photoList = photos ? photos.concat($scope.uploadedFiles) : null;
			}else {
				photoList = photos;
			}
		}

		let showcaseIndex;
		try {
			showcaseIndex = photoList.findIndex(x => x.showcase === true);
		}catch (e){
			showcaseIndex = null;
		}

		data.eventCategory = $scope.eventCategories[$scope.newEventForm.eventCategory]._id;
		console.log(data.eventCategory);
		let isEdit = id !== 'false' ? true : false;

		$http({
			url: '/events/new',
			method: 'POST',
			data: {
				recaptcha: document.getElementById('g-recaptcha-response').value,
				data: data,
				isEdit: isEdit,
				adId: id,
				power: {
					powerStatus: $scope.buyPowerStatus,
					powerNumber: $scope.powerNumber,
				},
				photos: photoList,
				showcaseIndex: showcaseIndex,
			}
		}).then((response) => {
			$scope.submitBtnLoading = false;

			if(response.data.status === 1){
				$scope.eventSaveComplete = true;
				$window.scrollTo(0, 0);
			}
		}, () => { // optional
			$scope.submitBtnLoading = false;
			console.log('fail');
		});
	};

	$scope.newEventForm.showcaseIndex = 0;
	$scope.onPhotoSelect = () => {
		if ($scope.isEdit){
			if ($scope.uploadedFiles < 1)
				$scope.newEventForm.files[0].showcase = true;
		}else{
			if ($scope.newEventForm.files.length > 0)
				$scope.newEventForm.files[$scope.newEventForm.showcaseIndex].showcase = true;
		}
	};

	$scope.onDeletePhoto = (index) => {
		$scope.newEventForm.files.splice(index, 1);
		if ($scope.newEventForm.showcaseIndex === index){
			$scope.newEventForm.files[0].showcase = true;
			$scope.newEventForm.showcaseIndex = 0;
		}
	};

	$scope.onSelectShowCase = (index) => {
		$scope.newEventForm.files[$scope.newEventForm.showcaseIndex].showcase = false;

		$scope.newEventForm.showcaseIndex = index;
		$scope.newEventForm.files[index].showcase = true;
	};

	$scope.triggerUploadWindow = () => {
		$('input[type="file"]').trigger('click');
	};

	/*let completeSaveAd = () => {
		$scope.openSignInModal();
		$scope.powerTab();
		$scope.nextLoader = false;
	};*/

	$scope.previewTab = () => {
		$scope.steps.informations = false;
		$scope.steps.power = false;
		$scope.steps.preview = true;
		$window.scrollTo(0, 0);
	};

	$scope.powerTab = () => {
		$scope.steps.informations = false;
		$scope.steps.power = true;
		$scope.steps.preview = false;
		$window.scrollTo(0, 0);
	};

	$scope.adInformationTab = () => {
		$scope.steps.informations = true;
		$scope.steps.power = false;
		$scope.steps.preview = false;
		$window.scrollTo(0, 0);
	};


	// recaptcha
	$scope.activeSaveBtn = false;
	$scope.successCaptcha = () => {
		$scope.activeSaveBtn = true;
	};
}]);



