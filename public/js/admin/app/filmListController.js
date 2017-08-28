app.controller('filmListController', ['$scope', '$http', function($scope, $http) {

  $scope.deleteFilm = function(filmId){
    $http.delete('/api/movie/delete/'+ filmId +'/?api_key='+ movielab_api_settings.api_key).then((res) => {
      let data = res.data;

      if (data.success) {
        $('#'+ filmId).remove();
      }
    });
  };

}]);

app.directive('ngReallyClick', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', () => {
        let message = attrs.ngReallyMessage;
        if (message && confirm(message)) {
          scope.$apply(attrs.ngReallyClick);
        }
      });
    }
  };
}]);