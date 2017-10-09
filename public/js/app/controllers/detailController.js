app.controller('detailController', ['$scope', 'detailFactory',  ($scope, detailFactory) => {

	$('.detail-right-menu a').popup({
		position: 'bottom center'
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

}]);
