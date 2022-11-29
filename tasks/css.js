/*
   Reades css files in src/css and moves them to the /public/assets/css folder.

   PostCSS is enabled allowing you to use many future CSS techniques not yet available
   in the browser that will be polyfilled in your compiled code... as well as some Sass-like helpers.

   Also allows the ability to import files from node_module libraries as well as your custom
   modularized css files
*/
import fs from 'fs';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import debug from 'gulp-debug';
import cssnano from 'cssnano';
import colors from 'colors/safe';
import filter from 'gulp-filter';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import sourcemaps from 'gulp-sourcemaps';
import beautifyCode from 'gulp-beautify-code';

/* Get browserlist array in package.json file */
const packageData = JSON.parse(fs.readFileSync('package.json'));
const browserslist = packageData.hasOwnProperty('browserslist') ? packageData.browserslist : [];

/* Filter function to remove css files that being with '_' from the public path */
const fileFilter = filter(['**', '!*src/css/**/_*.css'], {
   restore: false
});

/* determine if in production or dev mode */
const devMode = process.env.NODE_ENV !== 'production';

const distFolder = 'public/css';

/*
   post css plugins:

   postcss-import: allows you to import local and node_module css files into your
   main bundle to modularize your css into smaller chunks

   postcss-preset-env: options on how to transpile css.
      stage: 0 is the most experimental, but naturally you do not have to use any stage 0 features...

      features: You can eanble or disable features here.
      nesting-rules allow you to nest properties such as is common in Sass.
      custom-media-queries allow you write some simpler media query experssions.
      Check out the documentation for full list.

      preserve: Boolean to instruct all plugins to omit pre-polyfilled CSS

   https://github.com/csstools/postcss-preset-env
   https://preset-env.cssdb.org/

   cssnano: Minifies, autoprefixes, combines media queries, etc.
   https://cssnano.co/
*/
const postCssPlugins = [
   postcssImport(),
   postcssPresetEnv({
      stage: 0,
      features: {
         'custom-media-queries': true,
         'custom-properties': true,
         'custom-selectors': true,
         'media-query-ranges': true,
         'nesting-rules': true
      },
      browsers: browserslist,
      preserve: false
   }),
   cssnano({
      autoprefixer: {
         browsers: browserslist,
         add: true,
      },
      discardComments: {
         removeAll: true
      },
   })
];

export function gulpCss() {
   /* Scan css files in the src/css folder */
   return gulp.src(['src/css/**/*.css'])
   /* Setup sourcemaps */
   .pipe(sourcemaps.init())
   .on('error', function(err) {
      console.log('SOURCEMAPS');
      console.log(colors.red(err.toString()));
      this.emit('end');
   })
   /* Run css through postcss plugins */
   .pipe(postcss(postCssPlugins))
   .on('error', function(err) {
      console.log('POSTCSS');
      console.log(colors.red(err.toString()));
      this.emit('end');
   })
   /* Run css files through file filter */
   /*
   .pipe(fileFilter)
   .on('error', function(err) {
      console.log('FILTER');
      console.log(colors.red(err.toString()));
      this.emit('end');
   })
   */
   /* Write sourcemap */
   .pipe(gulpIf(devMode, sourcemaps.write('.')))
   .on('error', function(err) {
      console.log('SOURCEMAPS WRITE');
      console.log(colors.red(err.toString()));
      this.emit('end');
   })
   /*
      If in devMode, this will make the code clean to read through, delete is not necessary.
      If you do not want the code minified for production, remove the gulpIf function and
      simply add the beautifyCode function...
   */
   .pipe(gulpIf(devMode, beautifyCode({
      indent_size: 4,
      indent_char: ' '
    })))
    .on('error', function(err) {
      console.log('BEAUTIFY');
      console.log(colors.red(err.toString()));
      this.emit('end');
   })
    /* Output css file(s) */
	.pipe(gulp.dest(distFolder));
}
