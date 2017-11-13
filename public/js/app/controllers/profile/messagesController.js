/*eslint-disable */
app.controller('messagesController', ['$scope', '$rootScope', 'messageFactory', '$routeParams', function($scope, $rootScope, messageFactory, $routeParams){
/*eslint-enable */

	let objDiv = document.getElementById('messageList');

	$scope.sendMessageFormData = { };
	$scope.loadingMessages = false;

	$scope.loadingConversations = true;
	messageFactory.getConversations().then((response) => {
		$scope.loadingConversations = false;
		$scope.conversations = response;

		if ($routeParams.id){
			let ad = ($scope.conversations).find(x => String(x._id) === String($routeParams.id)).ad;
			$scope.activeConversationId = $routeParams.id;
			$scope.ad.title = ad.title;
			$scope.ad.price = ad.price;
			$scope.ad.slug = ad.slug;
			$scope.ad.id = ad._id;
			$scope.ad.showcasePhoto = ad.photos[ad.photoShowcaseIndex].filename;
		}
	});

	$scope.ad = { };
	if ($routeParams.id){
		setInterval(() => {
			$('#'+ $routeParams.id).hide(); // red circle
		}, 1200);

		$scope.sendMessageFormData.conversationId = $routeParams.id;
		$scope.visibleMessages = true;
		$scope.loadingMessages = true;

		messageFactory.getMessages($routeParams.id).then((response) => {
			$scope.loadingMessages = false;
			$scope.messages = response.data;
			$scope.sendMessageFormData.toUserId = response.toUserId;
			scrollDown();

			messageFactory.markAsRead($routeParams.id, $scope.sendMessageFormData.toUserId).then(() => {
				messageFactory.getUnreadMessages().then((response) => {
					$rootScope.messageLength = response.length;
				});
			});
		});
	}

	$scope.messageSended = false;
	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;

		messageFactory.createMessage($scope.sendMessageFormData, $scope.sendMessageFormData.conversationId).then((response) => {

			$scope.sendMessageLoading = false;
			if (response.status !== 1) {
				$scope.sendMessageErr = response.error;
				return false;
			}

			$scope.messages.push ({
				message: $scope.sendMessageFormData.message,
				createdAt: new Date(),
				user: {
					name: $scope.sendMessageFormData.username,
					surname: $scope.sendMessageFormData.surname
				}
			});

			$scope.sendMessageFormData.message = '';
			scrollDown();
		});
	};

	function scrollDown(){
		setTimeout(()=>{
			objDiv.scrollTop = objDiv.scrollHeight;
		},1);
	}
}]);
