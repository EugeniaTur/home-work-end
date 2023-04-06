const { parallel, src, dest, watch } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function cssTask() {
  return src('./scss/*.{sass,scss}')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(
      postcss([
        postcssSortMediaQueries({
          // sort: 'mobile-first' default value
          sort: 'desktop-first',
        }),
      ])
    )
    .pipe(sourcemaps.write())
    .pipe(dest('./css'))
    .pipe(browserSync.stream());
}

function browserSyncTask() {
  browserSync.init({
    server: {
      baseDir: './',
    },
    browser: 'google chrome',
  });
}

function watchTask() {
  watch('./scss/**/*.{sass,scss}', cssTask);
  watch('*.html').on('change', browserSync.reload);
}

exports.default = parallel(browserSyncTask, cssTask, watchTask);
