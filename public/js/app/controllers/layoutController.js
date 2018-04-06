app.controller('layoutController', ['$scope', '$rootScope', '$http', '$window', 'layoutFactory', 'messageFactory', 'vcRecaptchaService',   ($scope, $rootScope, $http, $window, layoutFactory, messageFactory, vcRecaptchaService) => {

	$scope.toggleSidebar = () => {
		$('.rightSidebar')
			.sidebar('setting', 'transition', 'overlay')
			.sidebar('toggle');
	};

	$(() => {
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
	let widgetId = null;
	$scope.loginFormData = { };
	$scope.signIn = () => {
		$scope.signInBtnLoading = true;

		layoutFactory.signIn($scope.loginFormData, false, $scope.signInRecaptchaResponse).then((response) => {
			$scope.signInBtnLoading = false;
			if (response.status === 1){
				$window.location.reload();
			}else {
				vcRecaptchaService.reload(widgetId);
				$scope.signInErr = response.error;
			}
		});
	};

	$scope.onWidgetCreate = (_widgetId) => {
		widgetId = _widgetId;
	};

	// Forgot Password
	$scope.forgotFormData = { };
	$scope.forgotPassword = () => {
		$scope.forgotBtnLoading = true;
		$scope.emailSended = false;

		layoutFactory.forgotPassword($scope.forgotFormData.email).then((response) => {
			$scope.forgotBtnLoading = false;
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
			if (response.status === 1){
				$scope.successSubscribe = true;
				$scope.subscribeErr = null;
			}else {
				$scope.subscribeErr = response.error;
			}
		});
	};

	$scope.init = (user) => {
		try{
			let data = JSON.parse(user);
			if(data){
				messageFactory.getUnreadMessages().then((response) => {
					$rootScope.messageLength = response.length;
				});
			}
		}catch(e){
			//
		}
	};

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
