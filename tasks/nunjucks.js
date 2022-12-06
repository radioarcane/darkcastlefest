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

         let textContent = '';

         item.content.forEach(o => {
            textContent += ` ${ o.text }`;
         });

         return Object.assign({}, item, {
            imageWebp: webp,
            imageAvif: avif,
            textContent: textContent.trim(),
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

      let jsonLd = {
         '@context': 'https://schema.org',
         '@type': 'MusicEvent',
         name: 'Dark Castle Fest',
         url: jsonData.domain,
         startDate: '2023-07-28T18:00',
         endDate: '2023-07-30T02:00',
         eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
         eventStatus: "https://schema.org/EventScheduled",
         image: jsonData.domain + '/images/dark-castle-festival-2023-poster.jpg',
         description: 'Radio Arcane presents Dark Castle Fest: A Gothic Music & Dark Arts Festival',
         sameAs: [
            jsonData.social.facebook,
            jsonData.social.instagram
         ],
         location: {
            '@type': 'Place',
            name: 'Art Sanctuary',
            address: {
               '@type': 'PostalAddress',
               streetAddress: '1433 S Shelby St.',
               addressLocality: 'Louisville',
               addressRegion: 'Kentucky',
               postalCode: '40217',
               addressCountry: 'US'
             },
             hasMap: 'https://www.google.com/maps/place/Art+Sanctuary/@38.2264103,-85.7413458,15z/data=!4m2!3m1!1s0x0:0xe8b5fa85d9ebd15f?ved=2ahUKEwjD0efWu_rfAhVKhq0KHV-nAdMQ_BIwDnoECAEQCA',
             sameAs: [
               'http://www.art-sanctuary.org',
               'https://www.facebook.com/pages/category/Arts---Entertainment/Art-Sanctuary-122260903695',
               'https://www.instagram.com/art.sanctuary'
             ]
         },
         offers: {
            '@type': 'Offer',
            description: 'Weekend Pass: $65, Single Day Pass: $45',
            url: jsonData.tickets,
            price: 65,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            validFrom: '2023-07-30'
         },
         eventStatus: 'https://schema.org/EventScheduled',
         organizer: {
            '@type': 'Organization',
            name: 'Radio Arcane',
            logo: 'https://www.radio-arcane.com/img/radio-arcane.jpg',
            url: 'https://www.radio-arcane.com',
            sameAs: [
               'https://www.facebook.com/RadioArcaneEvents',
               'https://www.instagram.com/radio_arcane',
               'https://www.youtube.com/@RadioArcane',
               'https://www.twitch.tv/radio_arcane_tv',
               'https://twitter.com/Radio_Arcane',
               'https://open.spotify.com/show/1agKdqPjtH92Gw33dcLbS1',
               'https://www.mixcloud.com/Radio-Arcane',
               'https://soundcloud.com/radio_arcane'
            ]
         },
         performer: jsonData.performers.filter(item => {
            return item.year === 2023;
         })
         .map(item => {
            let p = {
               '@type': 'MusicGroup',
               '@id': item.hasOwnProperty('@id') ? item['@id'] : null,
               name: item.name,
               description: item.textContent,
               logo: (() => {
                  if (item.logo) {
                     return {
                        '@type': 'ImageObject',
                        url: jsonData.domain + item.logo
                     };
                  }

                  return null;
               })(),
               image: {
                  '@type': 'ImageObject',
                  url: jsonData.domain + item.image
               },
               url: item.links.official ? item.links.official : null,
               genre: item.genres || [],
               sameAs: (() => {
                  let links = [];

                  Object.keys(item.links).forEach(prop => {
                     if (item.links[prop] && prop !== 'official') {
                        links.push(item.links[prop]);
                     }
                  });

                  return links;
               })(),
            };

            let obj = Object.assign({}, p);

            for (const prop in obj) {
               if (obj[prop] === null) {
                  delete obj[prop];
               }
            }
            
            return obj;
         }),
      };


      jsonData.jsonLd = {
         '2023': JSON.stringify(jsonLd),
      };


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
