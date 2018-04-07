const gulp = require('gulp');
const minifyCSS = require('gulp-minify-css');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

const bower_folder= './bower_components';

gulp.task('styles',() => {
	gulp.src('public/css/**/*.css')
		.pipe(minifyCSS({ keepBreaks : false }))
		.pipe(gulp.dest('public/dist/css'));
});

gulp.task('scripts',() => {
	gulp.src(['public/js/**/*.js'])
		.pipe(minify({
			ext:{
				min:'.min.js'
			},
			//exclude: ['tasks'],
			//ignoreFiles: ['.combo.js', '-min.js']
			noSource: true
		}))
		.pipe(gulp.dest('public/dist/js'));
});

gulp.task('layoutScripts',() => {
	return gulp.src([
		// angular.js
		`${ bower_folder }/angular/angular.min.js`,
		`${ bower_folder }/angular-route/angular-route.min.js`,

		// angular-file-upload
		`${ bower_folder }/ng-file-upload/ng-file-upload-shim.min.js`,
		`${ bower_folder }/ng-file-upload/ng-file-upload.min.js`,

		// ngImgCrop
		`${ bower_folder }/ng-img-crop/compile/minified/ng-img-crop.js`,

		// moment
		`${ bower_folder }/moment/min/moment.min.js`,
		`${ bower_folder }/angular-moment/angular-moment.min.js`,

		// angular-paging
		`${ bower_folder }/angular-paging/dist/paging.min.js`,

		// ng-image-gallery
		`${ bower_folder }/angular-animate/angular-animate.min.js`,
		`${ bower_folder }/ng-image-gallery/dist/ng-image-gallery.min.js`,

		// ng-wig
		`${ bower_folder }/ngWig/dist/ng-wig.min.js`,

		// angular-sanitize
		`${ bower_folder }/angular-sanitize/angular-sanitize.min.js`,

		// recaptcha
		`${ bower_folder }/angular-recaptcha/release/angular-recaptcha.min.js`,

		// angular-slugify
		`${ bower_folder }/angular-slugify/angular-slugify.js`,

		// jquery
		`${ bower_folder }/jquery/dist/jquery.min.js`,

		`${ bower_folder }/semantic/dist/semantic.min.js`,

		`${ bower_folder }/angular-google-places-autocomplete/dist/autocomplete.min.js`,

		'./public/dist/js/app/main.min.js',
		'./public/dist/js/app/services/profile/myMessageFactory.min.js',
		'./public/dist/js/app/services/layoutFactory.min.js',
		'./public/dist/js/app/controllers/layoutController.min.js',
	])
		.pipe(concat('layoutAll.min.js'))
		.pipe(gulp.dest('./public/dist/js/'));
});

gulp.task('watch',() => {
	gulp.watch('public/css/**/*.css',['styles']);
	gulp.watch('public/js/**/*.js',['scripts']);
	gulp.watch('public/js/**/*.js',['layoutScripts']);
});

gulp.task('default', ['styles','scripts', 'layoutScripts', 'watch']);
