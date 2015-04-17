var gulp = require("gulp")
var react = require("gulp-react")
var webserver = require("gulp-webserver")
var sourcemaps = require('gulp-sourcemaps')

gulp.task("build-jsx", function(){

  gulp.src("app.jsx")
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