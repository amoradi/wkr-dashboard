var gulp = require('gulp');
const concat = require("gulp-concat");
var pug = require('gulp-pug');
var scss = require('gulp-scss');
const babel = require('gulp-babel');
var js_minify = require('gulp-minify');
var minifyCSS = require('gulp-csso');
var transpile  = require('gulp-es6-module-transpiler');

gulp.task('html', function(){
  return gulp.src(['partials/html/index.pug', 'partials/html/detail/detail.pug'])
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
    .pipe(transpile({
      formatter: 'bundle'
    }))
    .pipe(babel({presets: ['es2015']}))
    .pipe(js_minify())
    .pipe(gulp.dest('build'))
});

gulp.task('default', [ 'html', 'css', 'js' ]);