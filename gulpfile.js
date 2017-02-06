var gulp = require('gulp');
var pug = require('gulp-pug');
var scss = require('gulp-scss');
const babel = require('gulp-babel');
var js_minify = require('gulp-minify');
var minifyCSS = require('gulp-csso');

gulp.task('html', function(){
  return gulp.src('partials/html/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'))
});

gulp.task('css', function(){
  return gulp.src('partials/css/base.scss')
    .pipe(scss())
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/styles'))
});

gulp.task('js', function(){
  return gulp.src('scripts/*.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(js_minify())
    .pipe(gulp.dest('build/scripts'))
});

gulp.task('default', [ 'html', 'css', 'js' ]);