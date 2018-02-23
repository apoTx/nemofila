app.factory('eventsFactory', ['$http', ($http) => {
	let getAllEvents = () => {
		return $http.get('/manage/events/getAllEvents')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	let publish = (data) => {
		console.log(data);
		return $http({
			url: '/manage/events/publish',
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
			url: '/manage/events/unpublish',
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
			url: '/manage/events/advanceSearch',
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
		publish: publish,
		unpublish: unpublish,
		advanceSearch: advanceSearch
	};
}]);
