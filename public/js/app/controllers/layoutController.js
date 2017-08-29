app.controller('layoutController', ['$scope',  ($scope) => {

  $scope.openSignUpModal = () => {
    $('#signUpModal').modal('show');
  };

}]);