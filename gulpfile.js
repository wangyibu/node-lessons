var gulp = require("gulp"),
  watch = require("gulp-watch"),
  ts = require('gulp-typescript'),
  changed = require('gulp-changed'),
  tsProject = ts.createProject('tsconfig.json');


gulp.task('develop-watch_ts', function () {
    gulp.watch('**/*.ts', ['develop-ts_single_compile']);
});

gulp.task('develop-ts_single_compile', function () {
    return gulp.src(['**/*.ts','!node_modules/**/*.ts','!typings/**/*.ts'])
            .pipe(ts(tsProject))
            .pipe(gulp.dest("."));
});
