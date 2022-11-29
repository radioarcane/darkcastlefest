import fs from "fs-extra";
import del from "del";
import gulp from "gulp";
import { watch as gulpWatch } from "gulp";
import { EventEmitter } from 'events';
import { scripts } from "./webpack";
import { server, serverReload } from "./server";
import { nunjucks as nunjucksRender } from "./nunjucks";
import { gulpCss } from "./css";
import { gulpImages } from "./images";
import { siteMap } from "./siteMap";
//import { gulpWebpDev } from './webpDev';
//import { gulpWebpProd } from './webpProd';
import { getJsonData } from './util/jsonData';
/*
const createTmpFolders = () => {
   const tmpFolder = "./tmp";

   del.sync(tmpFolder, {
      force: true
   });

   if (!fs.existsSync(tmpFolder)) {
      fs.mkdirSync(tmpFolder);
   }

   [
      '/images'
   ].forEach(path => fs.mkdirSync(tmpFolder + path));
};
*/

const initDynamicPages = () => {
   return new Promise((resolve, reject) => {
      const data = getJsonData();

      data.performers.forEach((item, i) => {
         let folder = '';

         switch (item.type) {
            case 'dj':
               folder = `./src/html/djs/${ item.slug }`;
               break;

            case 'band':
            default:
               folder = `./src/html/bands/${ item.slug }`;
               break;
         }

         if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
         }


/*
{% if metaDescription %}
   <meta name="description" content="{{ metaDescription | truncate(252, true, '...') }}">
{% endif %}

{% if metaKeywords %}
   <meta name="keywords" content="{{ metaKeywords }}">
{% endif %}

{% if canonical %}
   <meta property="og:site_name" content="{{ siteName }}">
   <meta property="og:title" content="{{ metaPageTitle }}">
   <meta property="og:locale" content="en_US">

   {% if metaDescription %}
      <meta name="og:description" content="{{ metaDescription | truncate(252, true, '...') }}">
   {% endif %}

   {% if metaImage %}
*/

         if (item.type === 'band')
         {
            fs.writeFileSync(`${ folder }/index.njk`, 
               `{% set band = performers[${i}] %}\n
                {% extends '_layouts/band.njk' %}
               `
            );
         }

         if (item.type === 'dj')
         {
            fs.writeFileSync(`${ folder }/index.njk`, 
            `{% set dj = performers[${i}] %} {% extends '_layouts/dj.njk' %}`
         );
         }
      });

      resolve();
   });
};

const htmlHandler = (path) => {
   if (path.startsWith("src\\html\\_")) {
      console.log('Rebuilding site... this may take a minute.');

      nunjucksRender([
         'src/html/**/*',
         '!src/html/_*/',
         '!src/html/_*/**/*'
      ])
      .on('end', function(err) {
         serverReload();
      });
   }
   else {
      const files = Array.isArray(path) ? path : [path];
      nunjucksRender(files, serverReload);
   }
};

const cssHandler = () => {
   console.log('css handler');
   gulpCss()
   .on('end', function(err) {
      console.log('try server reload...');
      serverReload();
   });
};

const jsHandler = () => {
   scripts()
   .then(() => {
      serverReload();
   });
};

/*
   Primary command to work with while developing.
*/
async function watch() {
   //createTmpFolders();

   const distFolder = "./public";
   const eventListener = new EventEmitter();

   del.sync(distFolder, {
      force: true
   });

   if (!fs.existsSync(distFolder)) {
      fs.mkdirSync(distFolder);
   }

   await initDynamicPages();

   console.log('BUILDING FILES...');

   scripts();
   gulpCss();

   nunjucksRender([
      'src/html/**/*',
      '!src/html/_*/',
      '!src/html/_*/**/*',
   ])
   .on('end', function(err) {
      eventListener.emit('nunjucks complete');
   });

   eventListener.on('nunjucks complete', () => {
      console.log('FILES DONE... STARTING SERVER');

      server();

      const htmlWatcher = gulpWatch(['src/html/**/*']);
      const jsWatcher = gulpWatch(['src/js/**/*.js']);
      const cssWatcher = gulpWatch(['src/css/**/*.css']);

      //const imgWatcher = gulpWatch([
       //  'src/images/**/*.jpg',
       //  'src/images/**/*.png',
     // ]);

      htmlWatcher.on('change', htmlHandler);
      htmlWatcher.on('add', htmlHandler);

      htmlWatcher.on('unlink', (path, stats) => {
         serverReload();
      });

      cssWatcher.on('change', cssHandler);
      cssWatcher.on('add', cssHandler);
      cssWatcher.on('unlink', cssHandler);

      jsWatcher.on('change', jsHandler);
      jsWatcher.on('add', jsHandler);
      jsWatcher.on('unlink', jsHandler);

      //imgWatcher.on('add', (path, stats) => {
         //console.log(path);
         //console.log(path.replace('src\\images', ''));
         //gulpWebpDev([path]);
         //gulpWebpDev([path.replace('src\\images', '')]);
      //});

      //imgWatcher.on('change', (path, stats) => {
          //gulpWebpDev([path.replace('src\\images', '')]);
         // gulpWebpDev([path]);
     // });
   });


   //gulpWebpDev([
   //   "src/images/**/*.jpg",
   //   "src/images/**/*.png",
   //]);
}

export const dev = gulp.series(watch);

/*
   Primary command to build a production version of the site.
*/
export function build() {
   return new Promise(resolve => {
      const eventListener = new EventEmitter();

      //createTmpFolders();

      scripts();
      gulpCss();

      console.log('Building blog...');

      nunjucksRender([
         'src/html/**/*',
         '!src/html/_*/',
         '!src/html/_*/**/*',
      ])
      .on('end', function(err) {
         eventListener.emit('nunjucks complete');
      });

      eventListener.on('nunjucks complete', () => {

         /*
         console.log('Starting images...');

         gulpImages()
         .on('end', function() {
            gulpWebpProd();
         });
         */

         gulpImages();

         fs.copySync("./src/static", "./public");

         //siteMap();
      });

      resolve();
   });
}

export default dev;
