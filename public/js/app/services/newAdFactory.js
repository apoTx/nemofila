app.factory('newAdFactory', ['$http', ($http) => {
	let getLocationDetail = (lat, lng) => {
		return $http({
			url: 'https://maps.googleapis.com/maps/api/geocode/json',
			method: 'get',
			params: { latlng: lat +','+ lng, key: 'AIzaSyB_lGh1XHqm3h8QkP75avEWwP53G08K8EI' },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getLocationDetail: getLocationDetail
	};
}]);
