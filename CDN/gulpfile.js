"use strict";

var gulp = require("gulp");
const browsersync = require("browser-sync").create();
var sourcemaps = require("gulp-sourcemaps");

const merge = require("merge-stream");

//for js
var useref = require("gulp-useref");
var uglify = require("gulp-uglify-es").default;
var gulpIf = require("gulp-if");

//for css
var cssnano = require("gulp-cssnano");
var gulp_sass = require("gulp-sass");
var concat = require("gulp-concat");

//images which are cached
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache"); 

//development

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist",
      directory: true
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
  return del(["./dist"]);
}

function css() {
  return gulp
    .src('dev/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(gulp_sass({outputStyle: 'expanded'}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.stream());
}

function js() {
  return gulp
    .src('dev/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browsersync.stream());
}

function defaultCss() {
  return gulp
    .src([
      'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
      'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
      'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(gulp_sass({outputStyle: 'expanded'})) 
    .pipe(concat('default-css.css'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/lib/'))
    .pipe(browsersync.stream());
}

function defaultJs() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
      'node_modules/jquery-mousewheel/jquery.mousewheel.js', 
      'node_modules/jquery-validation/dist/jquery.validate.min.js',
      'node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('default-js.js'))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/lib/'))
    .pipe(browsersync.stream());
}

function images() {
  return gulp
    .src([
      'dev/images/**/*.+(png|jpg|gif|svg)'
    ])
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(browsersync.stream());
}

function libs() {
  return gulp
    .src([
      'dev/lib/**/*'
    ])
    .pipe(gulp.dest('dist/lib'))
    .pipe(browsersync.stream());
}

function fonts() {
  return gulp
    .src([
      'node_modules/@fortawesome/fontawesome-free/webfonts/*'
    ])
    .pipe(gulp.dest('dist/webfonts'));
}

function watchFiles() {
  gulp.watch("dev/scss/**/*", css);
  gulp.watch("dev/js/**/*", js);
  gulp.watch("dev/lib/**/*", libs);
}
 
var build =  gulp.parallel(css, defaultCss, defaultJs, libs, fonts);
var watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

exports.images = images;
exports.css = css;
exports.js = js;
exports.libs = libs;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;