app.controller('layoutController', ['$scope', '$http', '$window', ($scope, $http, $window) => {

  // SignUp form validation
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
      password: {
        identifier  : 'password',
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
    }
  });

  $scope.openSignUpModal = () => {
    $('#signUpModal').modal('show');
  };

  $scope.openSignInModal = () => {
    $('#signInModal').modal('show');
  };

  setTimeout(()=>{
    // $scope.openSignUpModal();
    $scope.openSignInModal();
  });

  // Sign Up
  $scope.signupForm = {};
  $scope.signUp = () => {
    $scope.registerBtnLoading = true;
    $http({
	  url: '/register',
	  method: 'POST',
	  data: { 'data' : $scope.signupForm }
    })
	  .then((response) => {
		  console.log(response);
		  $scope.registerBtnLoading = false;
      },
      () => { // optional
		  console.log('fail');
      });
  };

  // Sign In
  $scope.loginFormData = { };
  $scope.signIn = () => {
    $scope.signInBtnLoading = true;
    $http({
      url: '/login',
      method: 'POST',
      data: { 'data' : $scope.loginFormData }
    })
      .then((response) => {
        console.log(response);
        $scope.signInBtnLoading = false;
	    $window.location.reload();
      },
      () => { // optional
        console.log('fail');
      });
  };

}]);