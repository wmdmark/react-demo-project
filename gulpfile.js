var gulp = require('gulp')
var react = require('gulp-react')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var webserver = require('gulp-webserver')
var wrapCommonjs = require('gulp-wrap-commonjs')
var order = require("gulp-order")

var paths = {
  vendor: './src/vendor/**/*.js',
  jsx: './src/**/*.jsx',
  assets: ['./src/assets/**/*', './src/index.html']
}

gulp.task('vendor', function() {
  // Browserify/bundle the JS.
  return gulp.src(paths.vendor)
    .pipe(order([
      'commonjs-require.js'
    ]))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))
})

gulp.task('jsx', function() {
  // Browserify/bundle the JS.
  return gulp.src(paths.jsx)
    .pipe(sourcemaps.init())
    .pipe(wrapCommonjs({
      pathModifier: function(path) {
        path = path.replace('.jsx', '')
        path = path.replace(__dirname + '/src/', '')
        return path
      }
    }))
    .pipe(react())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))
})

gulp.task('assets', function(){
  gulp.src(paths.assets)
    .pipe(gulp.dest('./build'))
})

gulp.task('build', ['vendor', 'jsx', 'assets'])

gulp.task('serve', function(){
  gulp.src('./build')
    .pipe(webserver({
      livereload: true,
      port: 3000,
      open: true
    }))
})

gulp.task('watch', function(){
  gulp.watch(paths.vendor, ['vendor'])
  gulp.watch(paths.jsx, ['jsx'])
  gulp.watch(paths.assets, ['assets'])
})

gulp.task('default', ['build', 'watch', 'serve'])
