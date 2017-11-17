/*eslint-disable */
let app = angular.module('app',[
	'ngRoute',
	'ngFileUpload',
	'angularMoment',
	'thatisuday.ng-image-gallery',
	'ngWig',
	'ngSanitize',
	'bw.paging',
	'vcRecaptcha'
]);
/*eslint-enable */

/*eslint-disable*/
let checkoutHandler = StripeCheckout.configure({
	key: 'pk_test_1JpsNdtqXNvY0n3aKdDZxYap',
	locale: 'auto'
});
/*eslint-enable*/

/*eslint-disable*/
let app = angular.module('adminApp', ['slugifier','angularMoment']);

const path = '/manage';

app.controller('accountController',  ['$scope', 'accountFactory',  ($scope, accountFactory) => {
	// SignUp form validation
	$('#resetPaswordForm').form({
		keyboardShortcuts: false,
		on: 'blur',
		fields: {
			password: {
				identifier  : 'password',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a valid password'
					}
				]
			},
			passwordConfirm: {
				identifier: 'passwordConfirm',
				rules: [
					{
						type: 'match[password]',
						prompt: 'Mismatched Password'
					}]
			}
		},
		onSuccess: () => {
			$scope.resetPassword();
		}
	});

	$scope.passwordChanged = false;
	$scope.resetPassword = () => {
		$scope.resetPasswordBtnLoading = true;
		accountFactory.resetPassword($scope.resetPasswordData).then((response) => {
			$scope.resetPasswordBtnLoading = false;

			if (response.status === 1){
				$scope.passwordChanged = true;
			}else {
				$scope.resetPaswordErr = response.error;
			}
		});
	};

}]);

app.controller('contactController',  ['$scope', 'contactFactory',  ($scope, contactFactory) => {

	$('#contactForm').form({
		keyboardShortcuts: false,
		on: 'blur',
		inline : true,
		fields: {
			title: {
				identifier  : 'name',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a name.'
					}
				]
			},
			email: {
				identifier  : 'email',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a email.'
					},
					{
						type   : 'email',
						prompt : 'Please enter a valid email.'
					}
				]
			},
			subject: {
				identifier  : 'subject',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a subject.'
					},
					{
						type   : 'maxLength[300]',
						prompt : 'Subject can be up to {ruleValue} characters long.'
					}
				]
			},
			message: {
				identifier  : 'message',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a message.'
					},
					{
						type   : 'maxLength[2000]',
						prompt : 'Your message can be up to {ruleValue} characters long.'
					}
				]
			}
		},
		onSuccess: () => {
			$scope.onSubmit();
		}
	});

	$scope.contactForm = { };
	$scope.onSubmit = () => {
		$scope.loadingContact = true;
		contactFactory.sendMessage(Object.assign($scope.contactForm, { 'recaptcha': $scope.recaptchaResponse } )).then((response) => {
			console.log(response);
			if (response.status === 1){
				$scope.messageSended = true;
			}else{
				$scope.error = response.error;
			}

			$scope.loadingContact = false;
		});
	};

	$scope.activeSubmitBtn = false;
	$scope.successCaptcha = (response) => {
		$scope.recaptchaResponse = response;
		$scope.activeSubmitBtn = true;
	};
}]);

app.controller('detailController', ['$scope', 'favFactory', 'messageFactory', ($scope, favFactory, messageFactory) => {

	$('.detail-right-menu a').popup({
		position: 'bottom center'
	});

	// Send Message Form validation
	$('#sendMessageForm').form({
		keyboardShortcuts: false,
		on: 'blur',
		fields: {
			pw: {
				identifier  : 'message',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter your message.'
					},
					{
						type   : 'maxLength[600]',
						prompt : 'Your message can be up to {ruleValue} characters long.'
					}
				]
			}
		},
		onSuccess: () => {
			$scope.sendMessage();
		},
		onInvalid:() => {
			$scope.sendMessageErr = null;
		},
	});

	$scope.init = (userId, adId, photos, amazon_base_url) => {
		if ( userId !== 'null' ){
			favFactory.isFav(userId,adId).then((response) => {
				$scope.isFav = response.isFav;
			});
		}

		let photoList = JSON.parse(photos);
		photoList.forEach((elem,index)=>{
			elem.url = amazon_base_url+'/'+elem.filename;
			elem.id = index;
		});

		$scope.imagesa = photoList;
	};

	$scope.addFavourites = (adId, userId) => {
		favFactory.addFavourites(adId,userId).then((response) => {
			if (response.status){
				$scope.isFav = true;
			}
		});
	};

	$scope.delFavourites = (adId, userId) => {
		favFactory.delFavourites(adId,userId).then((response) => {
			if (response.status){
				$scope.isFav = false;
			}
		});
	};

	$(() => {
		$('#sendMessageModal').modal({
			onHide: function(){
				$scope.messageSended = false;
				$scope.sendMessageFormData.message = '';
				$('body').removeClass('ios11-input-bug-fixer');
			},
			onShow: () => {
				$('body').addClass('ios11-input-bug-fixer');
			}
		});
	});

	$scope.openSendMessageModal = () => {
		$('#sendMessageModal').modal('show');
	};

	/*setTimeout(() => {
		$scope.openSendMessageModal();
	});*/


	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;

		messageFactory.createConversation($scope.sendMessageFormData).then((response) => {
			if (response.status !== 1){
				$scope.sendMessageLoading = false;
				$scope.sendMessageErr = response.error;
				return false;
			}

			messageFactory.createMessage($scope.sendMessageFormData, response.conversationId).then((response) => {
				$scope.sendMessageLoading = false;
				if (response.status !== 1) {
					$scope.sendMessageErr = response.error;
					return false;
				}

				$scope.messageSended = true;
			});
		});
	};


	// Photo gallery
	$scope.methods = {};
	$scope.openGallery = function(){
		$scope.methods.open();
	};

	$scope.changePhoto = (index) => {
		$scope.showcase = $scope.photos[index].filename;
	};

	$scope.showcase = (data, showcaseIndex) => {
		$scope.photos = data;
		$scope.showcaseIndex = showcaseIndex;
		$scope.showcase = data[$scope.showcaseIndex].filename;
	};

}]);

app.config(['ngImageGalleryOptsProvider', function(ngImageGalleryOptsProvider){
	ngImageGalleryOptsProvider.setOpts({
		thumbnails  	:   true,
		thumbSize		: 	40,
		inline      	:   false,
		bubbles     	:   true,
		bubbleSize		: 	20,
		imgBubbles  	:   false,
		bgClose     	:   true,
		piracy 			: 	false,
		imgAnim 		: 	'fadeup',
	});
}]);

app.controller('indexController',  ['$scope', '$http', 'indexFactory', ($scope, $http, indexFactory) => {

	$scope.toggleFilterSidebar = () => {
		$('.filterSidebar')
			.sidebar('setting', 'transition', 'overlay')
			.sidebar('toggle');
	};

	$scope.newAdForm = {};

	$scope.init = (page) => {
		$scope.indexAdsLoading = true;
		$scope.advancedSearchVisible = false;

		indexFactory.getIndexAds(page).then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response.data;
			$scope.adPerPage = response.adPerPage;
			$scope.adCount = response.adCount;
			$scope.currentPage = response.page;
		});
	};

	$scope.searchForm = { };
	$scope.isSearch = false;
	$scope.resultNumber = 0;
	$scope.onSubmit = (toggleSidebar) => {
		$scope.indexAdsLoading = true;

		let location = { };
		try{
			location.countryId = $scope.countries[$scope.newAdForm.country]._id;
		}catch (e){
			location.countryId = null;
		}

		try{
			location.cityId = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city]._id;
		}catch (e){
			location.cityId = null;
		}

		try{
			location.districtId = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts[$scope.newAdForm.district]._id;
		}catch (e){
			location.districtId = null;
		}

		let category =  { };
		try{
			category.categoryId = $scope.categories[$scope.newAdForm.category]._id;
		}catch (e){
			category.categoryId = null;
		}

		try{
			category.categoryChildId = $scope.categories[$scope.newAdForm.category].subCategories[$scope.newAdForm.categoryChild]._id;
		}catch (e){
			category.categoryChildId = null;
		}

		indexFactory.searchAd($scope.searchForm.title, location, category).then((response) => {
			$scope.indexAdsLoading = false;
			$scope.ads = response.data;
			$scope.isSearch = true;
			$scope.resultNumber = response.data.length;
			$scope.adPerPage = response.adPerPage;
			$scope.adCount = response.adCount;
			$scope.currentPage = response.page;
			if (toggleSidebar)
				$scope.toggleFilterSidebar();
		});
	};

	$scope.advancedSearch = () => {
		if (!$scope.advancedSearchVisible){
			$scope.advancedSearchVisible = true;
		}else{
			$scope.advancedSearchVisible = false;
		}
	};
}]);

app.controller('layoutController', ['$scope', '$rootScope', '$http', '$window', 'layoutFactory', 'messageFactory', ($scope, $rootScope, $http, $window, layoutFactory, messageFactory) => {
	$scope.toggleSidebar = () => {
		$('.rightSidebar')
			.sidebar('setting', 'transition', 'overlay')
			.sidebar('toggle');
	};

	// SignUp form validation
	$('#signUpForm').form({
		keyboardShortcuts: false,
		on: 'blur',
		fields: {
			name: {
				identifier  : 'name',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter a name'
				}]
			},
			surname: {
				identifier  : 'surname',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a surname'
					}
				]
			},
			email: {
				identifier  : 'email',
				rules: [
					{
						type   : 'email',
						prompt : 'Please enter a valid e-mail'
					}
				]
			},
			number: {
				identifier  : 'number',
				rules: [
					{
						type   : 'number',
						prompt : 'Please enter a valid number'
					}
				]
			},
			password: {
				identifier  : 'password',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a valid password'
					}
				]
			},
			passwordConfirm: {
				identifier: 'passwordConfirm',
				rules: [
					{
						type: 'match[password]',
						prompt: 'Mismatched Password'
					}]
			}
		},
		onSuccess: () => {
			$scope.signUp();
		}
	});

	// SignIn form validation
	$('#signInForm').form({
		keyboardShortcuts: false,
		on: 'blur',
		fields: {
			email: {
				identifier  : 'email',
				rules: [
					{
						type   : 'email',
						prompt : 'Please enter a valid e-mail'
					}
				]
			},
			pw: {
				identifier  : 'pw',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter a password'
					}
				]
			}
		},
		onSuccess: () => {
			$scope.signIn();
		},
		onInvalid:() => {
			$scope.signInErr = null;
		},
	});

	// Forgot form validation
	$('#forgotForm').form( {
		keyboardShortcuts: false,
		on: 'blur',
		closable: false,
		fields: {
			name: {
				identifier: 'email',
				rules: [{
					type: 'email',
					prompt: 'Please enter a valid e-mail'
				}]
			},
		},
		onSuccess: () => {
			$scope.forgotPassword();
		}
	});

	// Forgot form validation
	$('#subscribeForm').form( {
		keyboardShortcuts: false,
		on: 'blur',
		closable: false,
		fields: {
			name: {
				identifier: 'email',
				rules: [{
					type: 'email',
					prompt: 'Please enter a valid e-mail'
				}]
			},
		},
		onSuccess: () => {
			$scope.subscribe();
		}
	});

	$(() => {
		$('#signInModal,#signUpModal, #forgotModal').modal({
			onShow: () => {
				$('body').addClass('ios11-input-bug-fixer');
			},
			onHide: () => {
				$('body').removeClass('ios11-input-bug-fixer');
			}
		});
	});

	$scope.openSignUpModal = (closeOther) => {
		if (closeOther){
			$('#signInModal').modal('show');
		}
		$('#signUpModal').modal('show');
	};

	$scope.openSignInModal = (closeOther) => {
		if (closeOther){
			$('#signUpModal').modal('show');
		}
		$('#signInModal').modal('show');
	};

	$scope.openForgotModal = (closeOther) => {
		if (closeOther){
			$('#signInModal').modal('show');
		}
		$('#forgotModal').modal({
			closable : false
		}).modal('show');
	};

	$scope.openSubscribeModal = () => {
		$('#subscribeModal').modal('show');
	};

	setTimeout(()=>{
		// $scope.openSignUpModal();
		// $scope.openSignInModal();
		// $scope.openNewAdModal();
		// $scope.openForgotModal();
	});

	// Sign Up
	$scope.signupForm = {};
	$scope.signUp = () => {
		$scope.registerBtnLoading = true;
		layoutFactory.signUp($scope.signupForm, $scope.signUpRecaptchaResponse).then((response) => {
			if (response.status === 1){
				// auto login
				layoutFactory.signIn({ email: $scope.signupForm.email }, true).then((response) => {
					$scope.registerBtnLoading = false;
					if (response.status === 1){
						$window.location.reload();
					}
				});
			}else {
				if(response.code === 11000){
					$scope.signUpErr = 'This email address is already in use.';
				}else {
					$scope.signUpErr = 'There was an unexpected problem.';
				}

				$scope.registerBtnLoading = false;
			}
		});
	};

	// Sign In
	$scope.loginFormData = { };
	$scope.signIn = () => {
		$scope.signInBtnLoading = true;

		layoutFactory.signIn($scope.loginFormData, false, $scope.signInRecaptchaResponse).then((response) => {
			$scope.signInBtnLoading = false;
			if (response.status === 1){
				$window.location.reload();
			}else {
				$scope.signInErr = response.error;
			}
		});
	};

	// Forgot Password
	$scope.forgotFormData = { };
	$scope.forgotPassword = () => {
		$scope.forgotBtnLoading = true;
		$scope.emailSended = false;

		layoutFactory.forgotPassword($scope.forgotFormData.email).then((response) => {
			$scope.forgotBtnLoading = false;
			console.log(response);
			if (response.status === 1){
				$scope.emailSended = true;
			}else {
				$scope.forgotErr = response.error;
			}
		});
	};

	// Subscribe
	$scope.subscribeFormData = { };
	$scope.subscribe = () => {
		$scope.subscribeBtnLoading = true;
		$scope.successSubscribe = false;

		layoutFactory.subscribe($scope.subscribeFormData.email).then((response) => {
			$scope.subscribeBtnLoading = false;
			console.log(response);
			if (response.status === 1){
				$scope.successSubscribe = true;
				$scope.subscribeErr = null;
			}else {
				$scope.subscribeErr = response.error;
			}
		});
	};

	messageFactory.getUnreadMessages().then((response) => {
		$rootScope.messageLength = response.length;
	});

	// recaptcha
	// signup
	$scope.activeRegisterBtn = false;
	$scope.successSignUpCaptcha = (response) => {
		$scope.activeRegisterBtn = true;
		$scope.signUpRecaptchaResponse = response;
	};

	// signin
	$scope.activeLoginBtn = false;
	$scope.successSignInCaptcha = (response) => {
		$scope.signInRecaptchaResponse = response;
		$scope.activeLoginBtn = true;
	};
}]);

app.controller('newAdController', ['$scope', 'Upload', '$timeout', '$http', '$window', 'countriesFactory', 'categoriesFactory', ($scope, Upload, $timeout, $http, $window, countriesFactory, categoriesFactory) => {

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

	$(() => {
		// stripe
		$('#buttonCheckout').on('click', () => {
			$scope.powerNumber = ($scope.powerNumber.split(':'))[1];
			if(parseInt($scope.powerNumber) > 0)
				checkoutHandler.open({
					name: 'Easyad',
					description: 'Power Purchase',
					token: handleToken
				});
		});

		$('.powerNumber').on('change', () => {
			$scope.powerNumber = $('.powerNumber').val();
		});

		function handleToken(token) {
			$scope.buyPowerLoader = true;
			$scope.$apply();
			fetch('/charge', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Object.assign(token, { amount: parseInt($scope.powerNumber) })),
			})
				.then(output => {
					if (output.statusText === 'OK') {
						$scope.buyPowerStatus = true;
						$scope.buyPowerLoader = false;
						$scope.$apply();
					}
				});
		}

		// # stripe

		$('#newAdForm').form({
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
				mobile_phone: {
					identifier  : 'mobile_phone',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please enter a mobile phone.'
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
				category: {
					identifier: 'category',
					rules: [
						{
							type   : 'empty',
							prompt : 'Please select a category.'
						}
					]
				}
			},
			onSuccess: () => {
				$scope.next();
			}
		});

		$(() => {
			$('#terms').on('click', () => {
				console.log('asd');
				$('#termsModal').modal('show');
			});

			$('#anotherPerson').checkbox({
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
	});

	$scope.init = (id, userExists) => {
		if (id !== 'false'){
			$scope.getAd(id);
			$scope.isEdit = true;
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
		if ( !$scope.isEdit )
			$scope.powerTab();
		else
			$scope.previewTab();

		$scope.$apply();
	};

	$scope.back = () => {
		if ( !$scope.isEdit )
			$scope.powerTab();
		else
			$scope.adInformationTab();
	};

	$scope.uploadedFiles = [];
	$scope.getAd = (id) => {
		$scope.loadingBufferData = true;
		$http( {
			url: '/newAd/getEditAd/' + id,
			method: 'GET',
		}).then( (response) => {

			$scope.newAdForm.title = response.data.title || '';
			$scope.newAdForm.description = response.data.description || '';
			$scope.newAdForm.phone = response.data.phone || '';
			$scope.newAdForm.mobile_phone = response.data.mobile_phone || '';
			$scope.newAdForm.address = response.data.address || '';
			$scope.newAdForm.website = response.data.website || '';
			$scope.newAdForm.anotherContact = response.data.anotherContact;
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

			let country = response.data.location;
			let category = response.data.category;
			setTimeout(() => {
				$scope.newAdForm.category = (($scope.categories).findIndex(x => String(x._id) === String(category.categoryId))).toString();
				$scope.newAdForm.categoryChild = (($scope.categories[$scope.newAdForm.category].subCategories).findIndex(x => String(x._id) === String(category.categoryChildId))).toString();

				$scope.newAdForm.country = (($scope.countries).findIndex(x => String(x._id) === String(country.countryId))).toString();
				$scope.newAdForm.city = (($scope.countries[$scope.newAdForm.country].cities).findIndex(x => String(x._id) === String(country.cityId))).toString();
				$scope.newAdForm.district = (($scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts).findIndex(x => String(x._id) === String(country.districtId))).toString();
			});

			$scope.loadingBufferData = false;
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

	$scope.adSaveComplete = false;
	$scope.submitBtnLoading = false;
	$scope.onSubmitAd = (photos, id, newPhotos) => {
		$scope.submitBtnLoading = true;

		let data = Object.assign({}, $scope.newAdForm);

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

		let district;
		try{
			district = $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city].districts[$scope.newAdForm.district]._id;
		}catch(e){
			district = null;
		}

		let childCategory;
		try{
			childCategory = $scope.categories[$scope.newAdForm.category].subCategories[$scope.newAdForm.categoryChild]._id;
		}catch(e){
			childCategory = null;
		}

		let isEdit = id !== 'false' ? true : false;

		$http({
			url: '/newAd/create',
			method: 'POST',
			data: {
				recaptcha: document.getElementById('g-recaptcha-response').value,
				data: data,
				isEdit: isEdit,
				editId: id,
				power: {
					powerStatus: $scope.buyPowerStatus,
					powerNumber: $scope.powerNumber,
				},
				photos: photoList,
				showcaseIndex: showcaseIndex,
				country: {
					countryId: $scope.countries[$scope.newAdForm.country]._id,
					cityId: $scope.countries[$scope.newAdForm.country].cities[$scope.newAdForm.city]._id,
					districtId: district
				},
				category: {
					categoryId: $scope.categories[$scope.newAdForm.category]._id,
					childCategoryId: childCategory
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
		if ($scope.isEdit){
			if ($scope.uploadedFiles < 1)
				$scope.newAdForm.files[0].showcase = true;
		}else{
			if ($scope.newAdForm.files.length > 0)
				$scope.newAdForm.files[$scope.newAdForm.showcaseIndex].showcase = true;
		}
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




app.controller('profileController', ['$scope', ($scope) => {
	$scope.init = (amazon_base_url, profile_locales) => {
		$scope.amazon_base_url = amazon_base_url;

		let profile_locale = JSON.parse(profile_locales);

		$scope.i18n_myAdsTitle = profile_locale.myAds.title;
		$scope.i18n_no_results = profile_locale.myAds.no_results;
		$scope.i18n_settings = profile_locale.myAds.settings;
		$scope.i18n_edit = profile_locale.myAds.edit;
		$scope.i18n_buy_power = profile_locale.myAds.buy_power;
		$scope.i18n_unpublish = profile_locale.myAds.unpublish;

		$scope.i18n_messagesTitle = profile_locale.messages.title;
		$scope.i18n_searchPlaceholder = profile_locale.messages.search;

		$scope.i18n_favTitle = profile_locale.favourites.title;

		$scope.i18n_buyPower_title = profile_locale.buyPower.title;
		$scope.i18n_power_up_text1 = profile_locale.buyPower.power_up_text1;
		$scope.i18n_power_up_text2 = profile_locale.buyPower.power_up_text2;
		$scope.i18n_buy_power_btn = profile_locale.buyPower.buy_power_btn;
		$scope.i18n_bought_power_message = profile_locale.buyPower.bought_power_message;
	};
}]);

app.config(['$routeProvider', ($routeProvider) => {
	$routeProvider
		.when('/myads', {
			templateUrl : 'partials/profile/myads.jade',
			controller: 'myAdsController',
		})
		.when('/buypower/:id', {
			templateUrl : 'partials/profile/buyPower.jade',
			controller: 'buyPowerController',
		})
		.when('/messages/:id?', {
			templateUrl : 'partials/profile/messages.jade',
			controller: 'messagesController'
		})
		.when('/myfavourites', {
			templateUrl : 'partials/profile/myFavourites.jade',
			controller: 'myFavouritesController'
		})
		.otherwise({
			redirectTo: '/myads'
		});
}]).run(['$rootScope', '$location', function($rootScope, $location){
	let path = function() { return $location.path();};
	$rootScope.$watch(path, (newVal) => {
		$rootScope.activetab = newVal.split('/')[1];
	});
}]);

app.directive('countryAndCategoryDropdowns', () => {
	return {
		template : '<div class="field" ng-click="updateMap()">\n' +
		'  <label>Country</label>\n' +
		'  <select name="country" ng-model="newAdForm.country" ng-options="index as country.name for (index, country) in countries " ng-change="changeCountry()">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>\n' +
		'<div class="field">\n' +
		'  <label>City</label>\n' +
		'  <select name="city" ng-disabled="visiblesCountries.cities" ng-model="newAdForm.city" ng-options="index as city.name for (index, city) in countries[newAdForm.country].cities" ng-change="changeCity()">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>\n' +
		'<div class="field">\n' +
		'  <label>District</label>\n' +
		'  <select name="district" ng-disabled="visiblesCountries.districts" ng-model="newAdForm.district" ng-options="index as district.name for (index, district) in countries[newAdForm.country].cities[newAdForm.city].districts" ng-change="changeDistrict()">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>\n' +
		'<div class="field">\n' +
		'  <label>Category</label>\n' +
		'  <select name="category" ng-model="newAdForm.category" ng-options="index as category.name for (index, category) in categories" ng-change="changeCategory()">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>\n' +
		'<div class="field">\n' +
		'  <label>Child Category</label>\n' +
		'  <select name="subCategory" ng-disabled="visiblesCategories.subCategory" ng-model="newAdForm.categoryChild" ng-options="index as subCategory.name for (index, subCategory) in categories[newAdForm.category].subCategories">' +
		'<option value="">Please select</option>' +
		'</select>\n' +
		'</div>',


		link: function($scope) {
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
		}

	};
});

app.filter('range', () => {
	return function(input, min, max) {
		min = parseInt(min); //Make string input int
		max = parseInt(max);
		for (let i=min; i<max; i++)
			input.push(i);
		return input;
	};
});

app.factory('accountFactory', ['$http', ($http) => {
	let resetPassword = (data) => {
		console.log(data);
		return $http({
			url: '/account/reset_password',
			method:'POST',
			data: data
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		resetPassword: resetPassword,
	};
}]);

app.factory('categoriesFactory', ['$http', ($http) => {
	let getCategories = () => {
		return $http.get('/categories/getCategories')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getCategories: getCategories
	};
}]);

app.factory('contactFactory', ['$http', ($http) => {
	let sendMessage = (data) => {
		return $http({
			url: '/contact',
			method:'POST',
			data: data
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		sendMessage: sendMessage,
	};
}]);

app.factory('countriesFactory', ['$http', ($http) => {
	let getCountries = () => {
		return $http.get('/countries/getCountries')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getCountries: getCountries
	};
}]);

app.factory('favFactory', ['$http', ($http) => {
	let addFavourites = (userId, adId) => {
		return $http({
			url: '/detail/addFavourites',
			method: 'get',
			params: { userId: userId, adId: adId },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let delFavourites = (userId, adId) => {
		return $http({
			url: '/detail/delFavourites',
			method: 'get',
			params: { userId: userId, adId: adId },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let isFav = (userId, adId) => {
		return $http({
			url: '/detail/isFav',
			method: 'get',
			params: { userId: userId, adId: adId },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		addFavourites: addFavourites,
		delFavourites: delFavourites,
		isFav: isFav
	};
}]);

app.factory('indexFactory', ['$http', ($http) => {
	let getIndexAds = (page) => {
		return $http({
			url: '/getIndexAds',
			method: 'get',
			params: { page: page }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let searchAd = (title, location, category) => {
		return $http({
			url: '/searchAd',
			method: 'get',
			params: { title: title, location: location, category: category },
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	return {
		getIndexAds: getIndexAds,
		searchAd: searchAd
	};
}]);

app.factory('layoutFactory', ['$http', ($http) => {
	let signIn = (data, autoLogin, recaptcha) => {
		return $http({
			url: '/login',
			method: 'POST',
			data: { 'data' : data, 'autoLogin': autoLogin, 'recaptcha': recaptcha }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	let signUp = (data, recaptcha) => {
		return $http({
			url: '/register',
			method: 'POST',
			data: { 'data' : data, 'recaptcha': recaptcha }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	let forgotPassword = (email) => {
		return $http({
			url: '/forgotPassword',
			method: 'POST',
			data: { 'email' : email }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	let subscribe = (email) => {
		return $http({
			url: '/subscribe',
			method: 'POST',
			data: { 'email' : email }
		}).then((response) => {
			return response.data;
		}, () => { // optional
			console.log('fail');
		});
	};

	return {
		signIn: signIn,
		signUp: signUp,
		forgotPassword: forgotPassword,
		subscribe: subscribe
	};
}]);

app.controller('adsController', ['$scope', '$http', 'adsFactory', '$window', ($scope, $http, adsFactory, $window) => {
	$scope.loadingAds = true;

	adsFactory.getAllAds().then((response) => {
		$scope.loadingAds = false;
		$scope.ads = response;
	});

	$scope.adEditForm = { };
	$scope.adEditForm.publishStatus = '1';
	$scope.adEditForm.reasonVisible = false;

	$scope.changeStatus = () => {
		if ($scope.adEditForm.publishStatus === '2')
			$scope.adEditForm.reasonVisible = true;
		else
			$scope.adEditForm.reasonVisible = false;
	};

	$scope.submitEdit = () => {
		$scope.loadingEditSubmit = true;
		adsFactory.publishAd($scope.adEditForm).then((response) => {
			console.log(response);
			$scope.loadingEditSubmit = false;

			if (response.status === 1){
				$window.location.reload();
			}
		});
	};

	$scope.unpublish = () => {
		let r = confirm('Are you sure?');
		if (r === true) {
			$scope.loadingUnpublish = true;
			adsFactory.unpublish($scope.adEditForm.id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};


	// Report
	$(() => {
		$('#startDate').calendar({
			type: 'date',
			formatter: {
				date: function (date) {
					if (!date) return '';
					let day = date.getDate() + '';
					if (day.length < 2) {
						day = '0' + day;
					}
					let month = (date.getMonth() + 1) + '';
					if (month.length < 2) {
						month = '0' + month;
					}
					let year = date.getFullYear();
					return year + '-' + month + '-' + day;
				}
			},
			onChange:  (date) => {
				$scope.searchForm.startDate = date;
			},
		});

		$('#endDate').calendar({
			type: 'date',
			formatter: {
				date: function (date) {
					if (!date) return '';
					let day = date.getDate() + '';
					if (day.length < 2) {
						day = '0' + day;
					}
					let month = (date.getMonth() + 1) + '';
					if (month.length < 2) {
						month = '0' + month;
					}
					let year = date.getFullYear();
					return year + '-' + month + '-' + day;
				}
			},
			onChange:  (date) => {
				$scope.searchForm.endDate = date;
			},
		});
	});

	$scope.searchForm = { };
	$scope.advanceSearch = () => {
		$scope.loadingAds = true;
		console.log($scope.searchForm);
		adsFactory.advanceSearch($scope.searchForm).then((response) => {
			$scope.loadingAds = false;
			$scope.ads = response;
			console.log(response);
		});
	};

}]);

app.controller('adsEditController', ['$scope', '$http', 'adsFactory', '$window', ($scope, $http, adsFactory, $window) => {

	$scope.adEditForm = { };
	$scope.adEditForm.publishStatus = '1';
	$scope.adEditForm.reasonVisible = false;

	$scope.changeStatus = () => {
		if ($scope.adEditForm.publishStatus === '2')
			$scope.adEditForm.reasonVisible = true;
		else
			$scope.adEditForm.reasonVisible = false;
	};

	$scope.submitEdit = () => {
		$scope.loadingEditSubmit = true;
		adsFactory.publishAd($scope.adEditForm).then((response) => {
			console.log(response);
			$scope.loadingEditSubmit = false;

			if (response.status === 1){
				$window.location.reload();
			}
		});
	};

	$scope.unpublish = () => {
		let r = confirm('Are you sure?');
		if (r === true) {
			$scope.loadingUnpublish = true;
			adsFactory.unpublish($scope.adEditForm.id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};

}]);

app.controller('categoryController', ['$scope', '$http',  ($scope, $http) => {
	$scope.categories = {
		selected: {
			index: 0,
			_id: 0
		},
		form: {
			category: {
				name: ''
			},
			subCategory: {
				name: '',
			},
		},
		list: []
	};

	$scope.city = {
		selected: {
			index: 0,
			_id: 0
		}
	};

	$scope.visibles = {
		subCategory: false,
	};

	$scope.init = () => {
		$http({
			url: path +'/categories/getCategories',
			method: 'GET',
		}).then((response) => {
			console.log(response);
			$scope.categories.list = response.data;
		}, () => { // optional
			console.log('fail');
		});

	};

	$scope.selectCategory = (index) => {
		$scope.visibles.subCategory = true;
		$scope.categories.selected.index = index;
		$scope.categories.selected._id = $scope.categories.list[index]._id;
	};

	$scope.saveCategory = () => {
		if ($scope.categories.form.category.name !== ''){
			$http({
				url: path +'/categories/saveCategory',
				method: 'POST',
				data: { 'name': $scope.categories.form.category.name }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1) {
					$scope.categories.list.push( { name: response.data.name, _id: response.data._id } );
					$scope.categories.form.category.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveSubCategory = () => {
		if ($scope.categories.form.subCategory.name !== ''){
			$http({
				url: path +'/categories/saveSubCategory',
				method: 'POST',
				data: { 'name': $scope.categories.form.subCategory.name, 'countryId': $scope.categories.selected._id }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1){
					try{
						$scope.categories.list[$scope.categories.selected.index].subCategories.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.categories.list[$scope.categories.selected.index].subCategories = [];
						$scope.categories.list[$scope.categories.selected.index].subCategories.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.categories.form.subCategory.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteCategory = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/categories/deleteCategory',
				method: 'DELETE',
				data: { '_id': $scope.categories.list[index]._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.categories.list.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteSubCategory = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/categories/deleteSubCategory',
				method: 'DELETE',
				data: {
					'_id': $scope.categories.list[$scope.categories.selected.index].subCategories[index]._id,
					'categoryId': $scope.categories.selected._id
				},
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.categories.list[$scope.categories.selected.index].subCategories.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};
}]);

app.controller('countryController', ['$scope', '$http',  ($scope, $http) => {
	$scope.countries = {
		selected: {
			index: 0,
			_id: 0
		},
		form: {
			country: {
				name: ''
			},
			city: {
				name: '',
			},
			district: {
				name: ''
			}
		},
		list: []
	};

	$scope.city = {
		selected: {
			index: 0,
			_id: 0
		}
	};

	$scope.visibles = {
		cities: false,
		district: false
	};

	$scope.init = () => {
		$http({
			url: path +'/countries/getCountries',
			method: 'GET',
		}).then((response) => {
			console.log(response);
			$scope.countries.list = response.data;
		}, () => { // optional
			console.log('fail');
		});

	};

	$scope.selectCountry = (index) => {
		$scope.visibles.cities = true;
		$scope.visibles.district = false;
		$scope.countries.selected.index = index;
		$scope.countries.selected._id = $scope.countries.list[index]._id;
	};

	$scope.selectCity = (index) => {
		$scope.visibles.district = true;
		$scope.city.selected.index = index;
		$scope.city.selected._id = $scope.countries.list[$scope.countries.selected.index].cities[index]._id;
	};

	$scope.saveCountry = () => {
		if ($scope.countries.form.country.name !== ''){
			$http({
				url: path +'/countries/saveCountry',
				method: 'POST',
				data: { 'name': $scope.countries.form.country.name }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1) {
					$scope.countries.list.push( { name: response.data.name, _id: response.data._id } );
					$scope.countries.form.country.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveCity = () => {
		if ($scope.countries.form.city.name !== ''){
			$http({
				url: path +'/countries/saveCity',
				method: 'POST',
				data: { 'name': $scope.countries.form.city.name, 'countryId': $scope.countries.selected._id }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1){
					try{
						$scope.countries.list[$scope.countries.selected.index].cities.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.countries.list[$scope.countries.selected.index].cities = [];
						$scope.countries.list[$scope.countries.selected.index].cities.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.countries.form.city.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.saveDistrict = () => {
		if ($scope.countries.form.district.name !== ''){
			$http({
				url: path +'/countries/saveDistrict',
				method: 'POST',
				data: { 'name': $scope.countries.form.district.name, 'countryId': $scope.countries.selected._id, 'cityId': $scope.city.selected._id, 'cityIndex':$scope.city.selected.index  }
			}).then((response) => {
				console.log(response);
				if (response.data.status === 1){
					try{
						$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts.push({ name: response.data.name, _id: response.data._id });
					}catch (e){
						$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts = [];
						$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts.push({ name: response.data.name, _id: response.data._id });
					}
					$scope.countries.form.district.name = '';
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteCountry = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/countries/deleteCountry',
				method: 'DELETE',
				data: { '_id': $scope.countries.list[index]._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.countries.list.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteCity = (index) => {
		let confirm = window.confirm('Are you sure ?');

		if (confirm){
			$http({
				url: path +'/countries/deleteCity',
				method: 'DELETE',
				data: { '_id': $scope.countries.list[$scope.countries.selected.index].cities[index]._id, 'countryId': $scope.countries.selected._id },
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.countries.list[$scope.countries.selected.index].cities.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

	$scope.deleteDistrict = (index) => {
		let confirm = window.confirm('Are you sure ?');

		console.log(index);

		if (confirm){
			$http({
				url: path +'/countries/deleteDistrict',
				method: 'DELETE',
				data: {
					'_id': $scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts[index]._id,
					'cityId': $scope.city.selected._id,
					'countryId': $scope.countries.selected._id
				},
				headers: {
					'Content-type': 'application/json;charset=utf-8'
				}
			}).then((response) => {
				if(response.data.status === 1){
					$scope.countries.list[$scope.countries.selected.index].cities[$scope.city.selected.index].districts.splice(index, 1);
				}
			}, () => { // optional
				console.log('fail');
			});
		}
	};

}]);

app.controller('usersController', ['$scope', '$http', 'usersFactory', ($scope, $http, usersFactory) => {

	$scope.loadingUsers = true;

	usersFactory.getAllUsers().then((response) => {
		$scope.loadingAds = false;
		$scope.users = response;
	});

}]);

app.factory('adsFactory', ['$http', ($http) => {
	let getAllAds = () => {
		return $http.get('/manage/ads/getAllAds')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let publishAd = (data) => {
		console.log(data);
		return $http({
			url: '/manage/ads/publishAd',
			method: 'POST',
			data: data,
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let unpublish = (id) => {
		return $http({
			url: '/manage/ads/unpublish',
			method: 'POST',
			data: { id: id },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let advanceSearch = (data) => {
		return $http({
			url: '/manage/ads/advanceSearch',
			method: 'GET',
			params: { data: data },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllAds: getAllAds,
		publishAd: publishAd,
		unpublish: unpublish,
		advanceSearch: advanceSearch
	};
}]);

app.factory('usersFactory', ['$http', ($http) => {
	let getAllUsers = () => {
		return $http.get('/manage/users/getAllUsers')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let advanceSearch = (data) => {
		return $http({
			url: '/manage/ads/advanceSearch',
			method: 'GET',
			params: { data: data },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllUsers: getAllUsers,
		advanceSearch: advanceSearch
	};
}]);

/*eslint-disable */
app.controller('buyPowerController', ['$scope', 'buyPowerFactory', '$window', '$routeParams', function($scope, buyPowerFactory, $window, $routeParams){
/*eslint-enable */

	if ($routeParams.id){
		let id = $routeParams.id;
		$scope.loadingAd = true;
		buyPowerFactory.getAd(id).then((result) => {
			console.log(result);
			$scope.loadingAd = false;
			$scope.ad = result;
		});
	}

	$scope.powerNumber = '0';
	$scope.buyPowerLoader = false;
	$scope.buyPowerStatus = false;

	$(() => {
		// stripe
		$('#buttonCheckout').on('click', () => {
			$scope.powerNumber = ($scope.powerNumber.split(':'))[1];
			console.log($scope.powerNumber);
			if(parseInt($scope.powerNumber) > 0)
				checkoutHandler.open({
					name: 'Easyad',
					description: 'Power Purchase',
					token: handleToken
				});
		});

		$('.powerNumber').on('change', () => {
			$scope.powerNumber = $('.powerNumber').val();
		});

		function handleToken(token) {
			$scope.buyPowerLoader = true;
			$scope.$apply();
			fetch('/charge', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Object.assign(token, { amount: parseInt($scope.powerNumber) })),
			})
				.then(output => {
					if (output.statusText === 'OK') {
						buyPowerFactory.savePower($routeParams.id, $scope.powerNumber).then(() => {
							$scope.buyPowerLoader = false;
							$scope.buyPowerStatus = true;
						});
					}
				});
		}
		// # stripe
	});

}]);

/*eslint-disable */
app.controller('messagesController', ['$scope', '$rootScope', 'messageFactory', '$routeParams', function($scope, $rootScope, messageFactory, $routeParams){
/*eslint-enable */

	let objDiv = document.getElementById('messageList');

	$scope.sendMessageFormData = { };
	$scope.loadingMessages = false;

	$scope.loadingConversations = true;
	messageFactory.getConversations().then((response) => {
		$scope.loadingConversations = false;
		$scope.conversations = response;

		if ($routeParams.id){
			let ad = ($scope.conversations).find(x => String(x._id) === String($routeParams.id)).ad;
			$scope.activeConversationId = $routeParams.id;
			$scope.ad.title = ad.title;
			$scope.ad.price = ad.price;
			$scope.ad.slug = ad.slug;
			$scope.ad.id = ad._id;
			$scope.ad.showcasePhoto = ad.photos[ad.photoShowcaseIndex].filename;
		}
	});

	$scope.ad = { };
	if ($routeParams.id){
		setInterval(() => {
			$('#'+ $routeParams.id).hide(); // red circle
		}, 1200);

		$scope.sendMessageFormData.conversationId = $routeParams.id;
		$scope.visibleMessages = true;
		$scope.loadingMessages = true;

		messageFactory.getMessages($routeParams.id).then((response) => {
			$scope.loadingMessages = false;
			$scope.messages = response.data;
			$scope.sendMessageFormData.toUserId = response.toUserId;
			scrollDown();

			messageFactory.markAsRead($routeParams.id, $scope.sendMessageFormData.toUserId).then(() => {
				messageFactory.getUnreadMessages().then((response) => {
					$rootScope.messageLength = response.length;
				});
			});
		});
	}

	$scope.messageSended = false;
	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;

		messageFactory.createMessage($scope.sendMessageFormData, $scope.sendMessageFormData.conversationId).then((response) => {

			$scope.sendMessageLoading = false;
			if (response.status !== 1) {
				$scope.sendMessageErr = response.error;
				return false;
			}

			$scope.messages.push ({
				message: $scope.sendMessageFormData.message,
				createdAt: new Date(),
				user: {
					name: $scope.sendMessageFormData.username,
					surname: $scope.sendMessageFormData.surname
				}
			});

			$scope.sendMessageFormData.message = '';
			scrollDown();
		});
	};

	function scrollDown(){
		setTimeout(()=>{
			objDiv.scrollTop = objDiv.scrollHeight;
		},1);
	}
}]);

/*eslint-disable */
app.controller('myAdsController', ['$scope', 'myAdsFactory', '$window', function($scope, myAdsFactory, $window){
/*eslint-enable */
	$scope.loadingMyAds = true;

	myAdsFactory.getMyAds().then((response) => {
		$scope.loadingMyAds = false;
		$scope.myAds = response;
	});

	$scope.onUnpublish = (id) => {
		let r = confirm('Are you sure?');
		if (r === true) {
			$scope.loadingUnpublish = true;
			myAdsFactory.unpublish(id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};

	$scope.update = (id) => {
		$scope.loading = true;
		myAdsFactory.update(id).then(() => {
			$scope.loading = false;
			$window.location.reload();
		});
	};
}]);

/*eslint-disable */
app.controller('myFavouritesController', ['$scope', 'myFavouritesFactory' ,  function($scope, myFavouritesFactory){
/*eslint-enable */
	$scope.loadingMyFavourites = true;

	myFavouritesFactory.getMyFavourites().then((response) => {
		$scope.loadingMyFavourites = false;
		$scope.myFavourites = response;
		console.log(response);
	});
}]);

app.factory('buyPowerFactory', ['$http', ($http) => {
	let getAd = (id) => {
		return $http({
			url: 'profile/buyPower/getAdById',
			method:'GET',
			params: { id: id }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let savePower = (adId, powerNumber) => {
		return $http({
			url: 'profile/buyPower/savePower',
			method: 'POST',
			data: { adId: adId, powerNumber: powerNumber },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAd: getAd,
		savePower: savePower
	};
}]);

app.factory('myAdsFactory', ['$http', ($http) => {
	let getMyAds = () => {
		return $http.get('profile/adsMy/getMyAds')
			.then((response) => {
				return response.data;
			});
	};

	let unpublish = (id) => {
		return $http({
			url: 'profile/adsMy/unpublish',
			method: 'POST',
			data: { id: id },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let update = (id) => {
		return $http({
			url: 'profile/adsMy/update',
			method: 'POST',
			data: { id: id },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getMyAds: getMyAds,
		unpublish: unpublish,
		update: update
	};
}]);

app.factory('myFavouritesFactory', ['$http', ($http) => {
	let getMyFavourites = () => {
		return $http.get('profile/myFavourites/getMyFavourites')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getMyFavourites: getMyFavourites
	};
}]);

app.factory('messageFactory', ['$http', ($http) => {
	let createConversation = (data) => {
		return $http({
			url: '/profile/myMessages/createConversation',
			method:'POST',
			data: {
				adId: data.adId,
				fromUserId: data.fromUserId,
				toUserId: data.toUserId
			}
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getConversations = () => {
		return $http({
			url: '/profile/myMessages/getConversations',
			method:'GET',
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let createMessage = (data, conversationId) => {
		return $http({
			url: '/profile/myMessages/createMessage',
			method:'POST',
			data: {
				toUserId: data.toUserId,
				message: data.message,
				conversationId: conversationId,
			}
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getMessages = (conversationId) => {
		return $http({
			url: '/profile/myMessages/getMessages',
			method:'GET',
			params: { conversationId: conversationId }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getUnreadMessages = () => {
		return $http({
			url: '/profile/myMessages/getUnreadMessages',
			method:'GET',
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let markAsRead = (conversationId, toUserId) => {
		return $http({
			url: '/profile/myMessages/markAsRead',
			method:'GET',
			params: { conversationId: conversationId, toUserId: toUserId }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		createConversation: createConversation,
		getConversations: getConversations,
		createMessage: createMessage,
		getMessages: getMessages,
		getUnreadMessages: getUnreadMessages,
		markAsRead: markAsRead
	};
}]);
