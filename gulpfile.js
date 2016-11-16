
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
var concat = require('gulp-concat');
var config = require('gulp-config');
var mainBowerFiles = require('main-bower-files');
//var bower = require('gulp-bower-files');
var gulpFilter = require('gulp-filter');
var order = require('gulp-order');


var src = {
    sass: ['app/styles/sass/**/*.scss'],
    css: ['app/styles/**/*.css'],
    js: ['app/scripts/**/*.js'],
    bower: ['../personal-project/app/bower.json', 'app/.bowerrc']
}

var dist = {
    all: ['app/**/*'],
    css: 'app/styles/css',
    vendor: 'app/scripts/vendors'
}

gulp.task('bower', function() {
    var jsFilter = gulpFilter('bower_components/**/*.js')
    var cssFilter = gulpFilter('bower_components/**/*.css')
    return gulp.src(mainBowerFiles({
        paths: {
            bowerDirectory: 'app/bower_components',
            bowerrc: 'app/.bowerrc',
            bowerJson: 'app/bower.json'
        }
    }))
        // .pipe(concat('lib.js'))
        // .pipe(gulp.dest(dist.vendor));


        .pipe(rename({ suffix: '.ven' }))
        // .pipe(concat('vendor.js'))
        // .pipe(gulp.dest(dist.vendor))
        // // .pipe(jsFilter.restore())
        // .pipe(cssFilter)
        // .pipe(concat('vendor.css'))
        // .pipe(gulp.dest(dist.css))
        // // .pipe(cssFilter.restore())
        // .pipe(rename(function(path) {
        //   if (~path.dirname.indexOf('fonts')) {
        //     path.dirname = '/fonts'
        //   }
        // }))
        .pipe(gulp.dest(dist.vendor));
});


//scripts
gulp.task('scripts', ['bower'], function() {
    gulp.src(['app/scripts/**/*.js', '!app/scripts/**/*.min.js', '!app/scripts/**/*.es5.js', '!app/scripts/**/*.ven.js'])
        .pipe(plumber())
        .pipe(traceur())
        .pipe(rename({ suffix: '.es5' }))
        // .pipe(uglify())
        .pipe(gulp.dest('app/scripts'))
        .pipe(reload({ stream: true }));
});


gulp.task('styles', function() {
    gulp.src(src.sass)
        .pipe(plumber())
        .pipe(prefix('last 2 versions'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/styles/css/'))
        .pipe(reload({ stream: true }));
});

gulp.task('html', function() {
    gulp.src('app/**/*.html');
});



gulp.task('build:cleanfolder', function() {
    del([
        'build/**'
    ]);
});

gulp.task('build:copy', ['build:cleanfolder'], function() {
    return gulp.src('app/**/*')
        .pipe(gulp.dest('build/'))
});

gulp.task('build:remove', ['build:copy'], function(cb) {
    del([
        'build/styles/sass'
        // 'build/scripts/!(*.min.js)'
    ], cb);
});

//in cmd run gulp build to create the directory for deploy
gulp.task('build', ['build:copy', 'build:remove']);

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    })
});

//in cmd run gulp build:serve to test if files are working properly for deploy
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: './build'
        }
    })
});


//watch - run gulp in cmd to start watching and ctrl+c to stop
gulp.task('watch', function() {
    gulp.watch(src.bower, ['bower']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.src('app/**/*.html', ['html']);
});

//default
gulp.task('default', ['bower', 'scripts', 'styles', 'html', 'browser-sync', 'watch']);

