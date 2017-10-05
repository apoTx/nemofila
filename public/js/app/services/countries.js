app.factory('countriesFactory', ['$http', ($http) => {
	let getCountries = () => {
		return $http.get('/countries/getCountries')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getCountries: getCountries
	};
}]);
