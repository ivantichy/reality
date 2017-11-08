/* jshint esversion: 6 */

var web = 'http://aukcebydleni.dev';
var theme = './';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var uglifyjs = require('uglify-es');
var addsrc = require('gulp-add-src');
var rollup = require('gulp-rollup');

var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var iconfontTemplate = require('gulp-iconfont-template');
var path = require('path');

var fontName = 'iconfont';

gulp.task('css', function() {
  var processors = [
    require('postcss-partial-import'),
    require('postcss-mixins'),
    require('postcss-advanced-variables'),
    require('postcss-custom-media'),
    require('postcss-custom-properties'),
    require('postcss-media-minmax'),
    require('postcss-color-function'),
    require('postcss-nesting'),
    require('postcss-nested'),
    require('postcss-custom-selectors'),
    require('postcss-atroot'),
    require('postcss-property-lookup'),
    require('postcss-extend'),
    require('postcss-selector-matches'),
    require('postcss-selector-not'),

    require('postcss-flexbugs-fixes'),
    require('postcss-strip-inline-comments'),
  ];

  gulp.src([theme + '/css/src/styles.css', theme + '/css/src/ie-old.css'])
    .pipe(plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(postcss(processors))
    .pipe(rename({extname: '.css'}))
    .pipe(gulp.dest(theme+'/css/dest'))
    .pipe(browserSync.stream())
    .pipe(rename({suffix: '.min'}))
    .pipe(postcss([
      require('autoprefixer')({ browsers: ['> 2%'], remove: false }),
      require('cssnano')()
    ]))
    .pipe(gulp.dest(theme+'/css/dest'))
    .pipe(notify('css task finished'));
});

gulp.task('js', function() {

  var composer = require('gulp-uglify/composer');
  var minify = composer(uglifyjs, console);

  gulp.src([theme + '/js/src/**/*.js'])
  //gulp.src([theme + '/js/src/main.js'])
    .pipe(plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(rollup({
      entry: [theme + '/js/src/main.js'],
      format: 'cjs',
      treeshake: false,
      plugins: [
          //require('rollup-plugin-node-resolve')({ jsnext: false, main: true }),
          require('rollup-plugin-commonjs')({ include: 'node_modules/**' }),
          require("rollup-plugin-babel")({
            "presets": [["es2015", { "modules": false }]],
            "plugins": [["external-helpers"], ["transform-object-rest-spread"]]
          })
      ]
    }))
    .pipe(addsrc(theme + '/js/src/secondary.js'))
    .pipe(addsrc(theme + '/js/src/webcomponents-loader.js'))
    .pipe(require("gulp-include")())
    .pipe(gulp.dest(theme + '/js/dest'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minify ({output: {max_line_len : 2000}}))
    .pipe(plumber.stop())
    .pipe(gulp.dest(theme + '/js/dest'))
    .pipe(browserSync.stream())
    .pipe(notify('js task finished'));
});

gulp.task('image-theme', function() {
  const imagemin = require('gulp-imagemin');
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const imageminPngquant = require('imagemin-pngquant');

  gulp.src(theme + '/images/*')
      .pipe(imagemin(
        [
          imagemin.gifsicle(),
          imagemin.jpegtran(),
          /*
          vzhledem k tomu že některé obrázky již jsou komprimované, tak nastavuji 80,
          jinak doporučuji nastavit 60
          */
          imageminMozjpeg({quality: 80}),
          imagemin.optipng(),
          imageminPngquant({quality: '60-70'}),
          imagemin.svgo()
        ]
      ))
      .pipe(gulp.dest(theme + '/images/'));
});

gulp.task('svg', function () {
    return gulp
        .src(theme + '/svg/src/*.svg')
        .pipe(require('gulp-svgmin')(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        remove: true,
                        //prefix: prefix + '-',
                        minify: false
                    }
                }]
            };
        }))

        .pipe(require('gulp-cheerio')({
          run: function ($, file) {
            // změnit barevnou výplň
            $('circle').each(function () {
              $(this).attr('fill',  '#0ac1a2');
            });
          },parserOptions: { xmlMode: true }
        }))
        //.pipe(require('gulp-svgstore')())
        .pipe(gulp.dest(theme + '/svg/dest/'));
});

gulp.task('image-svg', function() {
  const imagemin = require('gulp-imagemin');
  gulp.src(theme + '/svg/src/*.svg')
      .pipe(imagemin(
        [
          imagemin.svgo()
        ]
      ))
      .pipe(gulp.dest(theme + '/svg/dest/'));
});

//todo: upravit nebo smazat
gulp.task('image-uploads', function() {
  const imagemin = require('gulp-imagemin');
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const imageminPngquant = require('imagemin-pngquant');

  gulp.src('./wp-content/uploads/**/*')
      .pipe(imagemin(
        [
          imagemin.gifsicle(),
          imagemin.jpegtran(),
          imageminMozjpeg({quality: 60}),
          imagemin.optipng(),
          imageminPngquant({quality: '60-70'}),
          imagemin.svgo()
        ]
      ))
      .pipe(gulp.dest('./wp-content/uploads/'));
});

gulp.task('iconfont', function(){
  gulp.src([theme+'/ikony/src/*.svg'])
    .pipe(iconfontTemplate({
      fontName: fontName,
      path: theme+'/ikony/src/_template.html',
      targetPath: './icon_template.html',
    }))
    .pipe(iconfontCss({
      fontName: fontName,
      path: theme+'/ikony/src/_template.css',
      targetPath: './_icons.css',
      fontPath: 'ikony/dest/'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
     }))
    .pipe(gulp.dest(theme+'/ikony/dest/'));
});

gulp.task('php', function() {
  browserSync.reload();
});

gulp.task('default', function() {
  browserSync.init({
    proxy: web
  });
  gulp.watch(theme + '/js/src/*.js', ['js']);
  gulp.watch(theme + '/css/src/*.css', ['css']);
  gulp.watch([
    theme + '/templates/**/*.php',
    theme + '/templates/**/*.twig',
    theme + '/data/**/*.yml',
    theme + '/elements/src/**/*.html'
  ], ['php']);
});
