const gulp = require('gulp');
const concat = require("gulp-concat");
const pug = require('gulp-pug');
const scss = require('gulp-scss');
const babel = require('gulp-babel');
const js_minify = require('gulp-minify');
const minifyCSS = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const transpile  = require('gulp-es6-module-transpiler');
const replace = require('gulp-replace-task');
const rename = require("gulp-rename");
const del = require('del');
const es = require('event-stream');
const argv = require('yargs').argv;
const entreToken = "1jpXSljWBfUO7KKn9tTT6hZOTWYqXGsVTJPTU1HVMShs";

// name must be 'parameterized'
const spreadsheetTokens = [
  {
    name: "el",
    token: "1jpXSljWBfUO7KKn9tTT6hZOTWYqXGsVTJPTU1HVMShs",
  },
  {
    name: "AdvantageTech",
    token: "1EPNBkax-XgZlMG-oAP1cE88jR4GwaG2jnZn49AqB2eE"
  },
  {
    name: "dr",
    token: "1ORXzCyXH8GO1APGVWxDfNbKOI8Z1C8WhasOCQVg0vto"
  },
  {
    name: "RamseyTech",
    token: "1vJVVOyP6h3V4wxtmBKBZpCkl1dRi5IGCmSdmTI-DGx0"
  },
  {
    name: "DigitalMarketer",
    token: "1z01d8CP-RsSGgCopY6NEq2Ql8HdNJoGx09cyXtxZfHo"
  },
  {
    name: "woodtex",
    token: "1YcihvdtK9GIZ7vjJp807Nn8rXqpO8eiAM8kgUoyPMGE"
  },
  {
    name: "LucasResearchGroup",
    token: "12bObSWZJWPUX5AhG7SOiomGRTLf_HYcSgh90hzVI3l8"
  },
  {
    name: "WendtGroup",
    token: "1lvlxZTY1Y2_qLdKupyrr-dx5rLc9CPHkJmU7AHZmmsQ"
  },
  {
    name: "FullCycleMarketing",
    token: "1Fg2caxWdjvm_XaGajHNI9rs4N38maqfBx8Tp9wCZ1wQ"
  }
];

gulp.task('npm-butter', () => {
  var scriptString = "";

  spreadsheetTokens.forEach(function(obj) {
    scriptString += `gulp butter --token=${obj.token} --name=-${obj.name};`;
  });

  return gulp.src('package.json', { base: './' })
    .pipe(replace({
      patterns: [
        {
          match: 'butter-html',
          replacement: `"${scriptString}"`
        }
      ]
    })).pipe(gulp.dest('.'));
});

gulp.task('setToken', () => {
  return gulp.src('scripts/global/dashboard_token_template.js')
    .pipe(replace({
      patterns: [
        {
          match: 'token',
          replacement: `"${argv.token || entreToken}"`
        }
      ]
    }))
    .pipe(rename(`dashboard_token.js`))
    .pipe(gulp.dest('scripts/global'))
});

gulp.task('html', ['css', 'js'], () => {
  return gulp.src(['partials/html/dashboard.pug', 'partials/html/detail/detail.pug'])
    .pipe(pug())
    .pipe(rename((path) => {
      if (typeof argv.name !== "undefined") {
        path.basename += `${argv.name}`;
      }
    }))
    .pipe(gulp.dest('build'))
});

gulp.task('butter-html', ['css', 'js'], () => {
  return gulp.src(['partials/html/dashboard_butter.pug', 'partials/html/detail/detail_butter.pug'])
    .pipe(pug())
    .pipe(rename((path) => {
      if (typeof argv.name !== "undefined") {
        path.basename += `${argv.name}`;
      }
    }))
    .pipe(gulp.dest('build_butter'))
});

gulp.task('css', () => {
  return gulp.src('partials/css/base.scss')
    .pipe(scss())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/styles'))
});

gulp.task('js', ['setToken'], () => {
  return gulp.src(['scripts/views/wkly_report_dashboard.js', 'scripts/views/wkly_report_detail.js'])
    .pipe(transpile({
      formatter: 'bundle'
    }))
    .pipe(babel({presets: ['es2015']}))
    .pipe(js_minify())
    .pipe(gulp.dest('build'))
});

gulp.task('del-build', () => {
  del(['build', 'build_butter']);
});

gulp.task('default', [ 'css', 'js', 'html' ]);
gulp.task('butter', [ 'css', 'js', 'butter-html' ]);