/*
   SiteMap Generator
*/
import colors from 'colors/safe';
import debug from 'gulp-debug';
import { getJsonData } from './util/jsonData';
import filter from 'gulp-filter';
import gulp from 'gulp';
import sitemap from 'gulp-sitemap';

const siteData = getJsonData();

/*
   Do not include these paths in site map...
*/
const fileFilter = filter([
   '**',
   '!*public/page-0.html',
   '!*public/error*',
   '!*public/404*',
   '!*public/google*',
   '!*public/djs/rick-bats/*'
], {
   restore: false
});

export function siteMap() {
   /* Scan for html files in the public folder */
   return gulp.src(['public/**/*.html'], {
      read: false,
   })
   /* Filter files */
   .pipe(fileFilter)
   /* Generate Sitemap */
	.pipe(sitemap({
		siteUrl: siteData.domain,
	}))
	.on('error', function(err){
		console.warn(colors.red(err));
		this.emit('end');
	})
   /* Output sitemap */
	.pipe(gulp.dest('public'));
}
