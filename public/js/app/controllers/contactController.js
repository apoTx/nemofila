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
		contactFactory.sendMessage($scope.contactForm).then((response) => {
			console.log(response);
		});
	};

}]);
