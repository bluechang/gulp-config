

const gulp 				= 	require('gulp');		
const del 	 			= 	require('del');
const runSequence  		= 	require('run-sequence');
const gulpLoadPlugins 	= 	require('gulp-load-plugins');
const browserSync   	= 	require('browser-sync').create();
const $ 				=	gulpLoadPlugins();



gulp.task('clean', ()=>{
	//del中的 '**', 会删除所有的 children 和 parent 
	return del(['dist/**']);
});


gulp.task('server:init', ()=>{
	browserSync.init({
		notify: false,
		port: 3000,
		server: { 
			baseDir: './dist'
		}
	});
});

gulp.task('watch', ()=>{
	gulp.watch('src/*.html', ['html']);  
	gulp.watch('src/static/less/*.less', ['styles']);
	gulp.watch('src/static/images/*', ['images']); 
	gulp.watch('src/static/lib/*.js', ['lib']);
	gulp.watch('src/static/js/*.js', ['scripts']); 
});



/*build*/
gulp.task('default', (callback)=>{
	// 数组里的是可以异步执行的
	runSequence('clean', ['html', 'styles', 'scripts', 'lib', 'images'], ['watch', 'server:init'], callback);
});

/*build*/
gulp.task('build', (callback)=>{
	
});

/*server*/
gulp.task('server', (callback)=>{
	
});

