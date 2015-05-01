var gulp = require("gulp")
var react = require("gulp-react")
var webserver = require("gulp-webserver")
var sourcemaps = require('gulp-sourcemaps')
var plumber = require('gulp-plumber')
var concat = require('gulp-concat')
var wrapCommonjs = require('gulp-wrap-commonjs')
var gif = require("gulp-if")
var del = require('del')
var runSequence = require('gulp-run-sequence')

var scriptsPath = ["./src/**/*.jsx", "./src/**/*.js"]
var vendorPath = ["./src/vendor/**/*.js"]

gulp.task("build-scripts", function(){
  gulp.src(scriptsPath)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gif(/[.]jsx/, react()))
    .pipe(wrapCommonjs({
      pathModifier: function (path) {
        path = path.replace(/.js$/, '')
        path = path.replace(__dirname + '/src/', '')
        return path
      }      
    }))
    .pipe(concat("app.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./build/scripts"))
})

gulp.task("build-vendor", function(){
  gulp.src(vendorPath)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat("vendor.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./build/scripts"))
})

gulp.task("static", function(){
  gulp.src("./src/index.html")
    .pipe(gulp.dest("./build"))
})

gulp.task("build-clean", function(){
  del(["./build"])
})

gulp.task("build", function(){
  runSequence("build-clean", ["build-scripts", "build-vendor", "static"])
})
  
gulp.task("watch", function(){
  gulp.watch(scriptsPath, ['build-scripts'])
  gulp.watch(vendorPath, ['build-vendor'])
})

gulp.task("serve", function() {
  gulp.src("./build")
    .pipe(webserver({
      livereload: true,
      open: true
    }))
})

gulp.task("default", ['build', 'watch', 'serve'])