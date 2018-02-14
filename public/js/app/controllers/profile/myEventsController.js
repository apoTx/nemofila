/*eslint-disable */
app.controller('myEventsController', ['$scope', 'eventFactory', function($scope, eventFactory){
/*eslint-enable */
	$scope.loadingMyEvents = true;

	eventFactory.getMyEvents().then((response) => {
		$scope.loadingMyEvents = false;
		$scope.myEvents = response;
	});

}]);
