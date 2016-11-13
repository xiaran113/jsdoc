'use strict'
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');

gulp.task('docs', function () {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJsdoc2md({ template: fs.readFileSync('./templates/readme.hbs', 'utf8') }))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('jsdoc2md failed'), err.message)
    })
    .pipe(rename(function (path) {
      path.extname = '.md'
    }))
    .pipe(gulp.dest('api'))
});
