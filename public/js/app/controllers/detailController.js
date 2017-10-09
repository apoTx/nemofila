app.controller('detailController', ['$scope', '$http', 'detailFactory',  ($scope, $http, detailFactory) => {
	$scope,$http;

	$('.detail-right-menu a').popup({
		position: 'bottom center'
	});

	$scope.init = (id) => {
		// console.log(id);
	};

	$scope.addFavourites = (adId, userId) => {
		console.log(adId);
		console.log(userId);

		detailFactory.addFavourites(adId,userId).then((response) => {
			console.log(response);
		});
	};

}]);
