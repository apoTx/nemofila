app.controller('eventDetailController', ['$scope', 'favFactory',  ($scope, favFactory) => {

	$scope.init = (userId, adId) => {
		if ( userId !== 'null' ){
			favFactory.isFav(userId, adId).then((response) => {
				$scope.eventIsFav = response.isFav;
			});
		}
	};

	$scope.addFavourites = (eventId, userId) => {
		favFactory.addFavourites(eventId,userId, 1).then((response) => {
			if (response.status){
				$scope.eventIsFav = true;
			}
		});
	};

	$scope.delFavourites = (adId, userId) => {
		favFactory.delFavourites(adId,userId).then((response) => {
			if (response.status){
				$scope.eventIsFav = false;
			}
		});
	};

}]);
