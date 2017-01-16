
/**
 *
 * gulp.src().pipe()的形式  或 能返回这样形式的  是流。
 * 
 * 除此外的都不是流，如：
 * gulp.task('server') 和 gulp.task('watch')
 *
 * gulp.task(name [,deps] [,fn])
 * fn能做到以下其中一点的，就支持异步任务：
 * 1、接受一个callback
 * 2、返回一个stream
 * 3、返回一个promise
 * 下面的，clean, html, less, js, lib, image 
 * 因为返回一个stream，将会异步执行。
 * 除此以外，将会同步执行
 *
 * 如需保证任务的顺序执行，可用插件run-sequence
 * 
 * 
 */

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

gulp.task('html', ()=>{					
	return gulp.src('src/*.html')
				.pipe(gulp.dest('dist'))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('styles', ()=>{
	return gulp.src('src/static/less/style.less')
				// .pipe($.sourcemaps.init())
				.pipe($.plumber())
				.pipe($.less())
				.pipe($.autoprefixer({
					browsers: ['Chrome > 0', 'ff > 0', 'ie > 0', 'Opera > 0', 'iOS > 0', 'Android > 0']
				}))
				.pipe($.cleanCss())
				.pipe($.rename({suffix: '.min'}))
				// .pipe($.sourcemaps.write())
				.pipe(gulp.dest('dist/static/css'))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('scripts', ()=>{  
	return gulp.src('src/static/js/*.js')
				// .pipe($.sourcemaps.init())
				.pipe($.concat('sky.js'))
				.pipe($.uglify())
				.pipe($.rename({suffix: '.min'}))
				// .pipe($.sourcemaps.write())
				.pipe(gulp.dest('dist/static/js'))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('images', ()=>{		
	return gulp.src('src/static/images/*')
				.pipe($.cache($.imagemin()))
				.pipe(gulp.dest('dist/static/images'))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('lib', ()=>{
	return gulp.src('src/static/lib/*.js')
				.pipe($.uglify())
				.pipe($.rename({suffix: '.min'}))
				.pipe(gulp.dest('dist/static/lib'))
				.pipe(browserSync.stream({once: true}));
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

/*dist*/
gulp.task('dist', (callback)=>{
	runSequence('clean', ['html', 'styles', 'scripts', 'lib', 'images'], callback);
});

/*server*/
gulp.task('server', (callback)=>{
	runSequence(['watch', 'server:init'], callback);
});

