app.controller('detailController', ['$scope', '$http',  ($scope, $http) => {
	$scope,$http;

	$('.detail-right-menu a').popup({
		position: 'bottom center'
	});

	$scope.init = (id) => {
		console.log(id);
	};

}]);
