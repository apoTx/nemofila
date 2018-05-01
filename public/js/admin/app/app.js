/*eslint-disable*/
let app = angular.module('adminApp', ['slugifier','angularMoment', 'ngFileUpload']);

const path = '/manage';

app.value('config', {
	's3_upload_url': 'https://easyad-static.s3-eu-central-1.amazonaws.com',
	's3_upload_signature_service_url': 'https://jqueryegitimseti.com/amazon-service.php',
});
