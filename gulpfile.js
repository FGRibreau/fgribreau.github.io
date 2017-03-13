const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const sizereport = require('gulp-sizereport');
const gulpSequence = require('gulp-sequence');
const fs = require('fs');
const webpack = require("webpack-stream");
const webpackConfig = require('./webpack.config');

// Gulp variables
const CONFIG = require('./config');

// Variables
const paths = {
  src: './src/',
  build: './dist/',
  html: {
    src: 'src/**/*.pug',
    dest: 'dist/'
  },
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  js: {
    src: 'src/script/*.js',
    dest: 'dist/js/'
  },
  img: {
    src: 'src/img/**/*',
    dest: 'dist/img/'
  }
};

// Settings
const autoprefixerOptions = {
  browsers: ['last 2 versions']
};

// Developpement's tasks
gulp.task('serve', [
  'sass', 'js', 'html', 'img'
], function() {
  browserSync.init({server: paths.build, open: false});
  gulp.watch(paths.scss.src, ['sass']);
  gulp.watch(paths.js.src, ['js']);
  gulp.watch(paths.html.src, ['html']);
});

gulp.task('sass', function() {
  return gulp.src(paths.scss.src).pipe(plugins.plumber({
    errorHandler: function(error) {
      console.log(error.message);
      this.emit('end');
    }
  })).pipe(plugins.sass()).pipe(gulp.dest(paths.scss.dest)).pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(paths.js.src).pipe(plugins.plumber({
    errorHandler: function(error) {
      console.log(error.message);
      this.emit('end');
    }
  })).pipe(webpack(webpackConfig)).pipe(gulp.dest(paths.js.dest)).pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src(paths.html.src).pipe(plugins.pug({basedir: paths.src, locals: CONFIG})).pipe(gulp.dest(paths.html.dest)).pipe(browserSync.stream());
});

gulp.task('img', function() {
  return gulp.src(paths.img.src).pipe(plugins.imagemin()).pipe(gulp.dest(paths.img.dest));
});

// Build's task
gulp.task('html-build', function() {
  return gulp.src(paths.html.src).pipe(plugins.pug({basedir: paths.src, locals: CONFIG})).pipe(gulp.dest(paths.html.dest));
});

gulp.task('sass-build', function() {
  return gulp.src(paths.scss.src).pipe(plugins.sass()).pipe(plugins.autoprefixer(autoprefixerOptions)).pipe(plugins.cleanCss()).pipe(gulp.dest(paths.scss.dest));
});

gulp.task('js-build', function() {
  return gulp.src(paths.js.src).pipe(webpack(webpackConfig)).pipe(gulp.dest(paths.js.dest));
});

gulp.task('img-build', function() {
  return gulp.src(paths.img.src).pipe(plugins.imagemin()).pipe(gulp.dest(paths.img.dest));
});

gulp.task('sizereport', function() {
  return gulp.src(`${paths.build}**`).pipe(sizereport({gzip: true}));
});

gulp.task('build', ['html-build', 'sass-build', 'js-build', 'img-build']);
gulp.task('default', gulpSequence('build'));

// Clean
gulp.task('clean', function() {
  return gulp.src('./dist', {read: false}).pipe(plugins.clean());
});
