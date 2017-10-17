app.controller('layoutController', ['$scope', '$http', '$window', 'layoutFactory', 'messageFactory', ($scope, $http, $window, layoutFactory, messageFactory) => {

	// SignUp form validation
	$('#signUpForm').form({
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

		layoutFactory.signUp($scope.signupForm).then((response) => {
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
			}
		});
	};

	// Sign In
	$scope.loginFormData = { };
	$scope.signIn = () => {
		$scope.signInBtnLoading = true;

		layoutFactory.signIn($scope.loginFormData).then((response) => {
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

	messageFactory.getUnreadMessages().then((response) => {
		$scope.messageLength = response.length;
	});
}]);
