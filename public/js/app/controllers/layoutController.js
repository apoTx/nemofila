app.controller('layoutController', ['$scope',  ($scope) => {

  $('#signUpForm').form({
    on: 'blur',
	  fields: {
      name: {
		  identifier  : 'name',
		  rules: [
          {
			  type   : 'empty',
			  prompt : 'Please enter a name'
          }
		  ]
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
          }
		  ]
      }
	  },
    onSuccess: () => {
      $scope.signUp();
    }
  });

  $scope.openSignUpModal = () => {
    $('#signUpModal').modal('show');
  };

  setTimeout(()=>{
    $scope.openSignUpModal();
  });

  $scope.signUp = () => {
    alert('sign up');
  };

}]);