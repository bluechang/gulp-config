

const gulp 			= 	require('gulp');
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

gulp.task('watch', ()=>{
	gulp.watch(paths.html.src, browserSync.reload);
	gulp.watch(paths.css.src, browserSync.reload);
	gulp.watch(paths.js.src, browserSync.reload);
	gulp.watch(paths.img.src, browserSync.reload);
});


gulp.task('server', ()=>{
	browserSync.init({
		notify: false,
		port: 3000,
		server: {
			baseDir: '.dist/'
		}
	})
});

gulp.task('build', ['watch', 'server']);

gulp.task('default', ['build']);








