app.factory('eventsFactory', ['$http', ($http) => {
	let getAllEvents = () => {
		return $http.get('/manage/events/getAllEvents')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let publishAd = (data) => {
		console.log(data);
		return $http({
			url: '/manage/events/publishAd',
			method: 'POST',
			data: data,
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let unpublish = (id) => {
		return $http({
			url: '/manage/ads/unpublish',
			method: 'POST',
			data: { id: id },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let advanceSearch = (data) => {
		return $http({
			url: '/manage/ads/advanceSearch',
			method: 'GET',
			params: { data: data },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllEvents: getAllEvents,
		publishAd: publishAd,
		unpublish: unpublish,
		advanceSearch: advanceSearch
	};
}]);
