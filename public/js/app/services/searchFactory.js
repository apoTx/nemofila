app.factory('searchFactory', ['$http', ($http) => {
	let getEventsByLocationName = (location) => {
		return $http( {
			url: '/search/getEventsByLocationName',
			method: 'GET',
			params: { location: location }
		} )
			.then( (response) => {
				return response.data;
			}, () => {
				console.log( 'fail' );
			});
	};

	return {
		getEventsByLocationName: getEventsByLocationName
	};
}]);
