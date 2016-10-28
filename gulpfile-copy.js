/**
 *
 * 
 * 参考：https://github.com/lisposter/gulp-docs-zh-cn/blob/master/API.md#gulptaskname--deps--fn
 * 
 * 
 * 由于task都是异步执行的，
 * 要实现顺序的执行，需要做两件事：
 * 1、给出一个提示，来告知 task 什么时候执行完毕
 * 2、并且再给出一个提示，来告知一个 task 依赖另一个 task 的完成
 *
 * 所以，需要层层依赖，gulp.task('default', ['lastTask']), 只需执行顺序中的最后一个task即可。
 *
 *
 * 注：
 * 要使task正确异步执行，需满足以下其中一点：
 * 1、接受一个 callback
 * 2、返回一个 stream
 * 3、返回一个 promise
 *
 * 由于gulp是stream(流式)操作，所以，返回一个stream比较常用
 * 
 */

const gulp 			= require('gulp');		
const del 	 		= require('del');
const less 			= require('gulp-less');
const autoprefixer 	= require('gulp-autoprefixer');
const minifyCss 	= require('gulp-minify-css');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const cache      	= require('gulp-cache');
const rename        = require('gulp-rename');
const browserSync   = require('browser-sync').create();


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
		src: ['src/static/less/**'],
		main: 'src/static/less/style.less',
		dest: 'dist/static/css'
	},
	js: {
		src: ['src/static/js/*.js'],
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
				.pipe(rename({suffix: '.min'}))
				.pipe(minifyCss())
				.pipe(gulp.dest(paths.less.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('js', ()=>{
	return gulp.src(paths.js.src)
				.pipe(gulp.dest(paths.js.dest))
				.pipe(uglify())
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
				.pipe(imagemin())
				.pipe(gulp.dest(paths.image.dest))
				.pipe(browserSync.stream({once: true}));
});

gulp.task('watch', ['html', 'less', 'js', 'lib', 'image'], (cb)=>{
	gulp.watch(paths.html.src, ['html']);
	gulp.watch(paths.less.src, ['less']);
	gulp.watch(paths.js.src, ['js']);
	gulp.watch(paths.image.src, ['image']);

	cb && cb();
});

gulp.task('server', ['clean', 'watch'], (cb)=>{
	browserSync.init({
		notify: false,
		port: 3000,
		server: {
			baseDir: './dist'
		}
	});

	cb && cb();
});

gulp.task('default', ['server']);


