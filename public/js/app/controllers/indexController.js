app.controller('indexController', ['$scope',  ($scope) => {

  $scope.openNewAdModal = () => {
    $('#newAdModal').modal('show');
  };

}]);