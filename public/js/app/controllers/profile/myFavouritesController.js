/*eslint-disable */
app.controller('myFavouritesController', ['$scope', 'myFavouritesFactory' ,  function($scope, myFavouritesFactory){
/*eslint-enable */
	$scope.loadingMyFavourites = true;

	myFavouritesFactory.getMyFavourites().then((response) => {
		$scope.loadingMyFavourites = false;
		$scope.myFavourites = response;
	});
}]);
