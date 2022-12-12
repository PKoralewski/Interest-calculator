"use strict";

/**
 * Require modules
 */
/* eslint-disable no-undef */
const { src, dest, task, parallel, watch } = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");
const browserify = require("browserify");
const tsify = require("tsify");
const glob = require("glob");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const path = require("path");
/* eslint-enable no-undef */

/**
 * Define constants
 */
const browserSyncFiles = [
  "./**/*.js",
  "!./**/*.js.map",
  "./**/*.css",
  "./**/*.html",
];
const browserSyncProxy = "http://localhost/";

const basenameTsSufix = ".min.js";
const basenameCssSufix = ".min";

const tsBasePaths = [`src/typescript/**/*.ts`];

const tsWatchPaths = tsBasePaths;

const scssBasePaths = [`src/styles/**/*.scss`];

const scssWatchPaths = scssBasePaths;

const scssSrcOptions = {
  sourcemaps: true,
  allowEmpty: true,
};

const scssOptions = {
  outputStyle: "compressed",
};

/**
 * Define tasks
 */

const doBrowserify = (element) => {
  const parsedPath = path.parse(element);

  browserify({
    entries: element,
    debug: false,
  })
    .plugin(tsify)
    .bundle()
    .pipe(source(`./dist/js/${parsedPath.name}${basenameTsSufix}`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(
      dest(function (file) {
        return file.base;
      })
    )
    .pipe(browserSync.stream());
};

const doBrowserSync = () => {
  browserSync.init(browserSyncFiles, {
    proxy: browserSyncProxy,
    open: false,
  });
};

const tsBrowserify = () => {
  return new Promise(function (resolve, reject) {
    try {
      tsBasePaths.forEach((tsBasePath) => {
        glob(tsBasePath, {}, function (er, files) {
          files.forEach(doBrowserify);
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

const tsWatch = () => watch(tsWatchPaths, tsBrowserify);

const scssCompile = () => {
  return src(scssBasePaths, scssSrcOptions)
    .pipe(sourcemaps.init())
    .pipe(sass(scssOptions).on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(
      rename(function (filePath) {
        filePath.basename += basenameCssSufix;
      })
    )
    .pipe(
      dest(function (file) {
        return "./dist/css";
      })
    )
    .pipe(browserSync.stream());
};

const scssWatch = () => watch(scssWatchPaths, scssCompile);

task("dev", parallel(tsWatch, scssWatch, doBrowserSync));
