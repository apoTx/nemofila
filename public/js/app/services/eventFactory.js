app.factory('eventFactory', ['$http', ($http) => {
	let getAd = (id) => {
		return $http({
			url: '/getAdById',
			method:'GET',
			params: { id: id }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getEventsByAdId = (id) => {
		return $http({
			url: '/events/getEventsByAdId',
			method:'GET',
			params: { adId: id }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let getMyEvents = (id) => {
		return $http({
			url: '/events/getMyEvents',
			method:'GET',
			params: { adId: id }
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAd: getAd,
		getEventsByAdId: getEventsByAdId,
		getMyEvents: getMyEvents
	};
}]);
