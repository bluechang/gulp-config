

const gulp 			= 	require('gulp');
const gulpSequence 	= 	require('gulp-sequence');
const browserSync   =	require('browser-sync').create();

const paths = {
	html: {
		src: ['*.html']
	},
	css: {
		src: ['static/css/**']
	},
	js: {
		src: ['static/js/**']
	},
	img: {
		src: ['static/images/**']
	}
};


gulp.task('server', ()=>{
	browserSync.init({
		notify: false,
		port: 3000,
		server: {
			baseDir: './'
		}
	})
});

gulp.task('html', ()=>{
	gulp.watch(paths.html.src, browserSync.reload);
});

gulp.task('css', ()=>{
	gulp.watch(paths.css.src, browserSync.reload);
});

gulp.task('js', ()=>{
	gulp.watch(paths.js.src, browserSync.reload);
});

gulp.task('img', ()=>{
	gulp.watch(paths.img.src, browserSync.reload);
});

gulp.task('build', (cb)=>{
	gulpSequence(['html', 'css', 'js', 'img'], 'server')(cb);
});


gulp.task('default', ['build']);








