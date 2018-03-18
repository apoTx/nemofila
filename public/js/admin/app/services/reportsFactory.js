app.factory('reportsFactory', ['$http', ($http) => {
	let getAllReports = () => {
		return $http.get('/manage/reports/getAllReports')
			.then((response) => {
				return response.data;
			}, () => {
				console.log('fail');
			});
	};

	return {
		getAllReports,
	};
}]);
