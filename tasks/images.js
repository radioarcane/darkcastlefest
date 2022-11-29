import colors from 'colors/safe';
import gulp from 'gulp';

export function gulpImages() {
   return gulp.src([
      'src/images/**/*'
   ])
	.pipe(gulp.dest('public/images'));
}
