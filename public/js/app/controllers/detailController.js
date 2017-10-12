app.controller('detailController', ['$scope', 'detailFactory',  ($scope, detailFactory) => {

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

	setTimeout(() => {
		$scope.openSendMessageModal();
	});

	$scope.messageSended = false;
	$scope.sendMessage = () => {
		$scope.sendMessageLoading = true;
		console.log($scope.sendMessageFormData);
	};

}]);
