app.controller('indexController', ['$scope',  ($scope) => {

  $scope.openNewAdModal = () => {
    $('.ui.modal').modal('show');
  };

}]);