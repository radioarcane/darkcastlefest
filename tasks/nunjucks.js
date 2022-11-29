/*
   Converts nunjucks templates in src/html folder to html files.
   Then moves the compiled html file to the /public folder.
*/
//import beautifyCode from 'gulp-beautify-code';
import colors from 'colors/safe';
import data from 'gulp-data';
//import debug from 'gulp-debug';
import del from 'del';
import fs from 'fs';
import { getJsonData } from './util/jsonData';
import gulp from 'gulp';
//import gulpIf from 'gulp-if';
import htmlmin from 'gulp-htmlmin';
import nunjucksRender from 'gulp-nunjucks-render';
import path from 'path';
import phObfuscate from 'posthtml-obfuscate';
import posthtml from 'gulp-posthtml';
import rename from 'gulp-rename';
import inlinesource from 'gulp-inline-source';

const devMode = process.env.NODE_ENV !== 'production';

const distFolder = './public';

//let jsonData = null;

export function nunjucks(src = [], onComplete = f => f) {
   console.log(`Converting page(s) to html`);

   return gulp.src(src)
   .pipe(data(function(file) {

      /*
      if (!jsonData) {
         jsonData = getJsonData();
      }*/

      let jsonData = getJsonData();

      const filePath = file.relative.replace(/\\/g, "/")
                       .replace('src/html', '')
                       .replace('index.njk', '')
                       .replace('.njk', '.html');

      jsonData.path = filePath;
      jsonData.currPage = `/${ filePath }`.slice(0, -1);
      jsonData.canonical = `${ jsonData.domain }/${ filePath }`;
      jsonData.production = devMode === false;
      jsonData.cacheBust = Date.now();

      jsonData.performers = jsonData.performers.map(item => {
         const webp = item.image ? item.image.replace('.jpg', '.webp') : null;
         const avif = item.image ? item.image.replace('.jpg', '.avif') : null;

         return Object.assign({}, item, {
            imageWebp: webp,
            imageAvif: avif,
         });
      });

      jsonData.bands = {};
      jsonData.djs = {};

      jsonData.performers.forEach(item => {
         if (item.type === 'band') {
            jsonData.bands[item.slug] = Object.assign({}, item);
         }

         if (item.type === 'djs') {
            jsonData.djs[item.slug] = Object.assign({}, item);
         }
      });

      return jsonData;
   }))
   .on('error', function(err) {
      console.log(colors.red(err.toString()));
      //this.emit('end');

      if (devMode === false) {
         this.emit('end');
      }
   })
   /* Convert Nunjucks templates to HTML */
   .pipe(nunjucksRender({
      path: ['src/html/']
   }))
   .on('error', function(err) {
      console.log(colors.red(err.toString()));
      //this.emit('end');

      if (devMode === false) {
         this.emit('end');
      }
   })
   .pipe(inlinesource({
      compress: true,
      rootpath: path.resolve('src'),
   }))
   .pipe(posthtml([
      phObfuscate({
         includeMailto: true
      })
   ]))
   //.pipe(debug())
   .on('error', function(err) {
      console.log(colors.red(err.toString()));
      this.emit('end');
   })
   .pipe(htmlmin({
      collapseWhitespace: true,
   }))
   /* If in production mode, minify html */
   /*
   .pipe(gulpIf(devMode === false, htmlmin({
      collapseWhitespace: true,
   })))
   .pipe(gulpIf(devMode, beautifyCode({
      indent_size: 4,
      indent_char: ' ',
      unformatted: ['code', 'pre']
    })))
    */
   .on('error', function(err) {
      console.log(colors.red(err.toString()));
      //this.emit('end');

      if (devMode === false) {
         this.emit('end');
      }
   })
   //.pipe(debug())
   .pipe(rename(function(path) {
      path.dirname = path.dirname.replace("src\\html\\","");
      path.dirname = path.dirname.replace("src\\html","");
   }))
   /* Output html files */
  .pipe(gulp.dest(distFolder))
   /* Delete empty nunjucks-related folders in public folder */
   .on('end', function() {
      onComplete();

      /* Delete folders/files in build folder that are not needed */
      ['components', 'data', 'layouts', 'macros', 'partials']
      .forEach(fileFolder => {
         const folderName = `${ distFolder }/_${ fileFolder }`;

         if (fs.existsSync(folderName)) {
            del(folderName, {
               force: true
            });
         }
      });
   });
}
