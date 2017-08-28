var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var minify = require('gulp-minify');

gulp.task('styles',function(){
    gulp.src('public/css/**/*.css')
        .pipe(minifyCSS({ keepBreaks : false }))
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('scripts',function(){
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

gulp.task('watch',function(){
    gulp.watch('public/css/**/*.css',['styles']);
    gulp.watch('public/js/**/*.js',['scripts']);
});

gulp.task('default', ['styles','scripts','watch']);
