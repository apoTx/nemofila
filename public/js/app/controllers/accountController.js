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

	$scope.resetPassword = () => {
		accountFactory.resetPassword($scope.resetPasswordData).then((response) => {
			console.log(response);
		});
	};

}]);
