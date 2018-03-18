app.factory('reportFactory', ['$http', ($http) => {

	let sendReport = (data) => {
		console.log(data);
		return $http({
			url: '/detail/sendReport',
			method: 'GET',
			params: { adId: data.adId, message: data.message },
		})
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		sendReport,
	};
}]);
