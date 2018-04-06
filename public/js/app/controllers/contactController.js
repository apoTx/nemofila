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
