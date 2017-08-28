let gulp = require('gulp');
let minifyCSS = require('gulp-minify-css');
let minify = require('gulp-minify');

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

gulp.task('watch',() => {
    gulp.watch('public/css/**/*.css',['styles']);
    gulp.watch('public/js/**/*.js',['scripts']);
});

gulp.task('default', ['styles','scripts','watch']);
