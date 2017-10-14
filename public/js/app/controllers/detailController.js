app.controller('detailController', ['$scope', 'detailFactory', 'messageFactory', ($scope, detailFactory, messageFactory) => {

	$('.detail-right-menu a').popup({
		position: 'bottom center'
	});

	// Send Message Form validation
	$('#sendMessageForm').form({
		on: 'blur',
		fields: {
			pw: {
				identifier  : 'message',
				rules: [
					{
						type   : 'empty',
						prompt : 'Please enter your message.'
					},
					{
						type   : 'maxLength[600]',
						prompt : 'Your message can be up to {ruleValue} characters long.'
					}
				]
			}
		},
		onSuccess: () => {
			$scope.sendMessage();
		},
		onInvalid:() => {
			$scope.sendMessageErr = null;
		},
	});

	$scope.init = (userId, adId) => {
		if ( userId !== null ){
			detailFactory.isFav(userId,adId).then((response) => {
				$scope.isFav = response.isFav;
			});
		}
	};

	$scope.addFavourites = (adId, userId) => {
		console.log(adId);
		console.log(userId);

		detailFactory.addFavourites(adId,userId).then((response) => {
			if (response.status){
				$scope.isFav = true;
			}
		});
	};

	$scope.delFavourites = (adId, userId) => {
		console.log(adId);
		console.log(userId);

		detailFactory.delFavourites(adId,userId).then((response) => {
			if (response.status){
				$scope.isFav = false;
			}
		});
	};

	$scope.openSendMessageModal = () => {
		$('#sendMessageModal').modal('show');
	};

	/*setTimeout(() => {
		$scope.openSendMessageModal();
	});*/


	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;

		messageFactory.createConversation($scope.sendMessageFormData).then((response) => {
			if (response.status !== 1){
				$scope.sendMessageLoading = false;
				$scope.sendMessageErr = response.error;
				return false;
			}

			messageFactory.createMessage($scope.sendMessageFormData, response.conversationId).then((response) => {
				$scope.sendMessageLoading = false;
				if (response.status !== 1) {
					$scope.sendMessageErr = response.error;
					return false;
				}

				$scope.messageSended = true;
			});
		});
	};

}]);
