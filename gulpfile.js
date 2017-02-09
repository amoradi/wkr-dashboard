const gulp = require('gulp');
const concat = require("gulp-concat");
const pug = require('gulp-pug');
const scss = require('gulp-scss');
const babel = require('gulp-babel');
const js_minify = require('gulp-minify');
const minifyCSS = require('gulp-csso');
const transpile  = require('gulp-es6-module-transpiler');

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
  return gulp.src(['scripts/views/wkly_report_dashboard.js', 'scripts/views/wkly_report_detail.js'])
    .pipe(transpile({
      formatter: 'bundle'
    }))
    .pipe(babel({presets: ['es2015']}))
    .pipe(js_minify())
    .pipe(gulp.dest('build'))
});

gulp.task('default', [ 'html', 'css', 'js' ]);