/*eslint-disable */
app.controller('messagesController', ['$scope', 'messageFactory', '$routeParams', function($scope, messageFactory, $routeParams){
/*eslint-enable */

	console.log(  $routeParams.id)

	$scope.loadingConversations = true;
	messageFactory.getConversations().then((response) => {
		$scope.loadingConversations = false;
		$scope.conversations = response;
		console.log(response);
	});

	$scope.messageSended = false;
	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;
	};
}]);
