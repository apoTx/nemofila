/*eslint-disable */
app.controller('messagesController', ['$scope', '$http',  function($scope, $http){
/*eslint-enable */

	$scope.messageSended = false;
	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;
		console.log($scope.sendMessageFormData);
	};
}]);
