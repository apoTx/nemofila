app.controller('accountController',  ['$scope', 'accountFactory',  ($scope, accountFactory) => {
	// SignUp form validation
	$('#resetPaswordForm').form({
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
