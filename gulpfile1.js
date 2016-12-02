
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
const sass 				= 	require('gulp-sass');
const autoprefixer 		= 	require('gulp-autoprefixer');
const cleanCss 			= 	require('gulp-clean-css');
const uglify        	= 	require('gulp-uglify');
const imagemin      	= 	require('gulp-imagemin');
const concat			= 	require('gulp-concat');
const rename        	= 	require('gulp-rename');
const cache      		= 	require('gulp-cache');
const gulpSequence  	= 	require('gulp-sequence');
const browserSync   	= 	require('browser-sync').create();


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
	}
};



gulp.task('clean', ()=>{
	return del([paths.base.dest]);
});

gulp.task('html', ()=>{
	return gulp.src(paths.html.src)
				.pipe(gulp.dest(paths.html.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('less', ()=>{
	return gulp.src(paths.less.main)
				.pipe(less())
				.pipe(autoprefixer({
					browsers: ['Chrome > 0', 'ff > 0', 'ie > 0', 'Opera > 0', 'iOS > 0', 'Android > 0']
				}))
				.pipe(gulp.dest(paths.less.dest))
				.pipe(cleanCss())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.less.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('sass', ()=>{
	return gulp.src(paths.sass.main)
				.pipe(sass().on('error', sass.logError)) 
				.pipe(autoprefixer({
					browsers: ['Chrome > 0', 'ff > 0', 'ie > 0', 'Opera > 0', 'iOS > 0', 'Android > 0']
				}))
				.pipe(gulp.dest(paths.sass.dest))
				.pipe(cleanCss())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.sass.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('js', ()=>{  
	return gulp.src(paths.js.src)
				.pipe(gulp.dest(paths.js.dest))
				.pipe(uglify())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.js.dest))
				.pipe(concat(paths.js.all))
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.js.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('lib', ()=>{
	return gulp.src(paths.lib.src)
				.pipe(gulp.dest(paths.lib.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('image', ()=>{
	return gulp.src(paths.image.src)
				.pipe(cache(imagemin()))
				.pipe(gulp.dest(paths.image.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('watch', ()=>{
	gulp.watch(paths.html.src, ['html']);  
	gulp.watch(paths.less.src, ['less']);
	gulp.watch(paths.sass.src, ['sass']);
	gulp.watch(paths.js.src, ['js']);
	gulp.watch(paths.lib.src, ['lib']);
	gulp.watch(paths.image.src, ['image']);
});

gulp.task('server', ()=>{
	browserSync.init({
		notify: false,
		port: 3000,
		server: {
			baseDir: './dist'
		}
	});
});

gulp.task('build', (cb)=>{
	// 数组里的是可以异步执行的
	gulpSequence('clean', ['html', 'less', 'js', 'lib', 'image'], ['watch', 'server'])(cb);
});

gulp.task('default', ['build']);