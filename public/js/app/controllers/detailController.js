app.controller('detailController', ['$scope', '$http', 'detailFactory',  ($scope, $http, detailFactory) => {
	$scope,$http;

	$('.detail-right-menu a').popup({
		position: 'bottom center'
	});

	$scope.init = (userId, adId) => {
		// console.log(id);

		console.log(userId);
		console.log(adId);

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
			console.log(response);
		});
	};

}]);
