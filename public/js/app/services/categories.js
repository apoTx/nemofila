app.factory('categoriesFactory', ['$http', ($http) => {
	let getCategories = () => {
		return $http.get('/categories/getCategories')
			.then((response) => {
				return response.data;
			});
	};

	return {
		getCategories: getCategories
	};
}]);
