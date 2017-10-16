app.controller('detailController', ['$scope', 'favFactory', 'messageFactory', ($scope, favFactory, messageFactory) => {

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

	$scope.init = (userId, adId, photos, uuid) => {
		if ( userId !== null ){
			favFactory.isFav(userId,adId).then((response) => {
				$scope.isFav = response.isFav;
			});
		}

		let photoList = JSON.parse(photos);
		photoList.forEach((elem,index)=>{
			elem.url = '/uploads/'+ uuid +'/'+elem.filename;
			elem.id = index;
		});

		$scope.imagesa = photoList;
		console.log($scope.imagesa);
	};

	$scope.addFavourites = (adId, userId) => {
		favFactory.addFavourites(adId,userId).then((response) => {
			if (response.status){
				$scope.isFav = true;
			}
		});
	};

	$scope.delFavourites = (adId, userId) => {
		favFactory.delFavourites(adId,userId).then((response) => {
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


	// Photo gallery
	$scope.methods = {};
	$scope.openGallery = function(){
		$scope.methods.open();
	};

}]);

app.config(['ngImageGalleryOptsProvider', function(ngImageGalleryOptsProvider){
	ngImageGalleryOptsProvider.setOpts({
		thumbnails  	:   true,
		thumbSize		: 	40,
		inline      	:   false,
		bubbles     	:   true,
		bubbleSize		: 	20,
		imgBubbles  	:   false,
		bgClose     	:   true,
		piracy 			: 	false,
		imgAnim 		: 	'fadeup',
	});
}]);
