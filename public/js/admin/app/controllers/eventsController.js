app.controller('eventsController', ['$scope', '$http', 'eventsFactory', '$window', ($scope, $http, eventsFactory, $window) => {
	$scope.loadingAds = true;

	eventsFactory.getAllEvents().then((response) => {
		$scope.loadingAds = false;
		$scope.events = response;
	});

	$scope.eventEditForm = { };
	$scope.eventEditForm.publishStatus = '1';
	$scope.eventEditForm.reasonVisible = false;

	$scope.changeStatus = () => {
		if ($scope.eventEditForm.publishStatus === '2')
			$scope.eventEditForm.reasonVisible = true;
		else
			$scope.eventEditForm.reasonVisible = false;
	};

	$scope.submitEdit = () => {
		$scope.loadingEditSubmit = true;
		eventsFactory.publish($scope.eventEditForm).then((response) => {
			console.log(response);
			$scope.loadingEditSubmit = false;

			if (response.status === 1){
				$window.location.reload();
			}
		});
	};

	$scope.unpublish = () => {
		let r = confirm('Are you sure?');
		if (r === true) {
			$scope.loadingUnpublish = true;
			eventsFactory.unpublish($scope.eventEditForm.id).then((response) => {
				$scope.loadingUnpublish = false;

				if (response.status === 1){
					$window.location.reload();
				}
			});
		}
	};


	// Report
	$(() => {
		$('#startDate').calendar({
			type: 'date',
			formatter: {
				date: function (date) {
					if (!date) return '';
					let day = date.getDate() + '';
					if (day.length < 2) {
						day = '0' + day;
					}
					let month = (date.getMonth() + 1) + '';
					if (month.length < 2) {
						month = '0' + month;
					}
					let year = date.getFullYear();
					return year + '-' + month + '-' + day;
				}
			},
			onChange:  (date) => {
				$scope.searchForm.startDate = date;
			},
		});

		$('#endDate').calendar({
			type: 'date',
			formatter: {
				date: function (date) {
					if (!date) return '';
					let day = date.getDate() + '';
					if (day.length < 2) {
						day = '0' + day;
					}
					let month = (date.getMonth() + 1) + '';
					if (month.length < 2) {
						month = '0' + month;
					}
					let year = date.getFullYear();
					return year + '-' + month + '-' + day;
				}
			},
			onChange:  (date) => {
				$scope.searchForm.endDate = date;
			},
		});
	});

	$scope.searchForm = { };
	$scope.advanceSearch = () => {
		$scope.loadingAds = true;
		console.log($scope.searchForm);
		eventsFactory.advanceSearch($scope.searchForm).then((response) => {
			$scope.loadingAds = false;
			$scope.ads = response;
			console.log(response);
		});
	};

}]);
