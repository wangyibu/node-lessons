var gulp = require('gulp');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');

gulp.task('less', function () {
    return gulp.src('less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

