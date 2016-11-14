
//require
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var del = require('del');
var traceur = require('gulp-traceur');

//scripts
gulp.task('scripts', function () {
    gulp.src(['app/scripts/**/*.js', '!app/scripts/**/*.min.js'])
        .pipe(plumber())
        .pipe(traceur())
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('app/scripts'))
        .pipe(reload({ stream: true }));
});


gulp.task('styles', function () {
    gulp.src('app/styles/sass/**/*.scss')
        .pipe(plumber())
        .pipe(prefix('last 2 versions'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/styles/css/'))
        .pipe(reload({ stream: true }));
});

gulp.task('html', function () {
    gulp.src('app/**/*.html');
});



gulp.task('build:cleanfolder', function () {
    del([
        'build/**'
    ]);
});

gulp.task('build:copy', ['build:cleanfolder'], function () {
    return gulp.src('app/**/*')
        .pipe(gulp.dest('build/'))
});

gulp.task('build:remove', ['build:copy'], function (cb) {
    del([
        'build/styles/sass',
        'build/scripts/!(*.min.js)'
    ], cb);
});

//in cmd run gulp build to create the directory for deploy
gulp.task('build', ['build:copy', 'build:remove']);

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './app'
        }
    })
});

//in cmd run gulp build:serve to test if files are working properly for deploy
gulp.task('build:serve', function () {
    browserSync({
        server: {
            baseDir: './build'
        }
    })
});


//watch - run gulp in cmd to start watching and ctrl+c to stop
gulp.task('watch', function () {
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.src('app/**/*.html', ['html']);
});

//default
gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);

