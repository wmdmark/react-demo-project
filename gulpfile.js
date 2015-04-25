var gulp = require("gulp")
var react = require("gulp-react")
var webserver = require("gulp-webserver")
var sourcemaps = require('gulp-sourcemaps')
var plumber = require('gulp-plumber')
var concat = require('gulp-concat')
var wrapCommonjs = require('gulp-wrap-commonjs')

gulp.task("build-jsx", function(){
  gulp.src("app.jsx")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(react())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./build"))
})
  
gulp.task("watch", function(){
  gulp.watch("app.jsx", ['build-jsx'])
})

gulp.task("serve", function() {
  gulp.src(".")
    .pipe(webserver({
      livereload: true,
      open: true
    }))
})

gulp.task("default", ['build-jsx', 'watch', 'serve'])