var gulp = require('gulp');
var jade = require('gulp-jade');
var nodemon = require('gulp-nodemon');

gulp.task('templates', function() {
    var YOUR_LOCALS = {};
    gulp.src('./source/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest('./wwwroot/'))
});

gulp.task('develop',['stylesheets', 'scripts', 'templates'], function () {
    nodemon({ script: 'app/server.js', watch: ['source/**/*.*']})
        .on('restart', function () {
            console.log('restarted!')
        })
});

gulp.task('stylesheets', function() {
    gulp.src('./source/stylesheets/*.css')
        .pipe(gulp.dest('./wwwroot/stylesheets/'));
});

gulp.task('scripts', function() {
    gulp.src('./source/javascript/*.js')
        .pipe(gulp.dest('./wwwroot/javascript/'));
});

gulp.task('watch', function(){
    gulp.watch('./source/javascript/*.js', ['scripts']);
    gulp.watch('./source/stylesheets/*.css', ['stylesheets']);
});

gulp.task('default', ['templates', 'scripts', 'stylesheets', 'watch', 'develop'], function() {
    // place code for your default task here
});