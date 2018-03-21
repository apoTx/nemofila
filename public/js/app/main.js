/*eslint-disable */
let app = angular.module('app',[
	'ngRoute',
	'ngFileUpload',
	'ngImgCrop',
	'angularMoment',
	'thatisuday.ng-image-gallery',
	'ngWig',
	'ngSanitize',
	'bw.paging',
	'vcRecaptcha',
	'google.places',
	'slugifier'
]);

app.value('config', {
	's3_upload_url': 'https://easyad-static.s3-eu-central-1.amazonaws.com',
});
/*eslint-enable */
