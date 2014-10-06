var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('templates', function() {
    var YOUR_LOCALS = {};
    gulp.src('./source/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest('./wwwroot/'))
});

gulp.task('stylesheets', function() {
    gulp.src('./source/stylesheets/*.css')
        .pipe(gulp.dest('./wwwroot/stylesheets/'));
});

gulp.task('default', ['templates', 'stylesheets'], function() {
    // place code for your default task here
});