
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
 * 下面的，clean, html, less, sass, js, lib, image 
 * 因为返回一个stream，将会异步执行。
 * 除此以外，将会同步执行
 *
 * 如需保证任务的顺序执行，可用插件gulp-sequence
 * 
 * 
 */

const gulp 				= 	require('gulp');		
const del 	 			= 	require('del');
const less 				= 	require('gulp-less');
const autoprefixer 		= 	require('gulp-autoprefixer');
const cleanCss 			= 	require('gulp-clean-css');
const uglify        	= 	require('gulp-uglify');
const imagemin      	= 	require('gulp-imagemin');
const concat			= 	require('gulp-concat');
const rename        	= 	require('gulp-rename');
const cache      		= 	require('gulp-cache');
const runSequence  		= 	require('run-sequence');
const browserSync   	= 	require('browser-sync');
const reload			=	browserSync.reload;


const paths = {
	base: {
		src: 'src',
		srcAll: 'src/**',
		dest: 'dist',
		destAll: 'dist/**'
	},
	html: {
		src: ['src/*.html'],
		dest: 'dist'
	},
	less: {
		src: ['src/static/less/*.less'],
		main: 'src/static/less/style.less',
		dest: 'dist/static/css'
	},
	sass: {
		src: ['src/static/sass/*.scss'],
		main: 'src/static/sass/style.scss',
		dest: 'dist/static/css'
	},
	js: {
		src: ['src/static/js/*.js'],
		all: 'sky.js',
		dest: 'dist/static/js'
	},
	lib: {
		src: ['src/static/lib/*.js'],
		dest: 'dist/static/lib'
	},
	image: {
		src: ['src/static/images/**'],
		dest: 'dist/static/images'
	},
	media: {
		src: ['src/static/images/**'],
		dest: 'dist/static/images'
	}
};



gulp.task('clean', ()=>{
	//del中的 '**', 会删除所有的 children 和 parent
	return del([paths.base.destAll]);
});

gulp.task('html', ()=>{
	return gulp.src(paths.html.src)
				.pipe(gulp.dest(paths.html.dest))
				.pipe(reload({ stream:true }));
});

gulp.task('less', ()=>{
	return gulp.src(paths.less.main)
				.pipe(less())
				.pipe(autoprefixer({
					browsers: ['Chrome > 0', 'ff > 0', 'ie > 0', 'Opera > 0', 'iOS > 0', 'Android > 0']
				}))
				.pipe(cleanCss())
				.pipe(rename({extname: '.min.css'}))
				.pipe(gulp.dest(paths.less.dest))
				.pipe(reload({ stream:true }));
});

gulp.task('js', ()=>{  
	return gulp.src(paths.js.src)
				.pipe(uglify())
				.pipe(concat(paths.js.all))
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.js.dest))
				.pipe(reload({ stream:true }));
});

gulp.task('image', ()=>{
	return gulp.src(paths.image.src)
				.pipe(cache(imagemin()))
				.pipe(gulp.dest(paths.image.dest))
				.pipe(reload({ stream:true }));
});

gulp.task('lib', ()=>{
	return gulp.src(paths.lib.src)
				.pipe(uglify())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.lib.dest))
				.pipe(reload({ stream:true }));
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
	gulp.watch(paths.html.src, ['html']);  
	gulp.watch(paths.less.src, ['less']);
	gulp.watch(paths.image.src, ['image']);
	gulp.watch(paths.media.src, ['media']);
	gulp.watch(paths.lib.src, ['lib']);
	gulp.watch(paths.js.src, ['js']); 
});



/*build*/
gulp.task('build', (callback)=>{
	// 数组里的是可以异步执行的
	runSequence('clean', ['html', 'less', 'js', 'lib', 'image'], ['watch', 'server:init'], callback);
});

/*dist*/
gulp.task('dist', (callback)=>{
	runSequence('clean', ['html', 'less', 'js', 'lib', 'image'], callback);
});

/*serve*/
gulp.task('server', (callback)=>{
	runSequence(['watch', 'server:init'], callback);
});

