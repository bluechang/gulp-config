

const gulp 			= require('gulp');
const del        	= require('del');
const less          = require('gulp-less');
const autoprefixer	= require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const rename        = require('gulp-rename');
const imagemin      = require('gulp-imagemin');
const gulpSequence  = require('gulp-sequence');
const browserSync   = require('browser-sync').create();


const files = {
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


gulp.task('html', ()=>{
	return gulp.src(files.html.src)
				.pipe(gulp.dest(files.html.dest));
});

gulp.task('less', ()=>{
	return gulp.src(files.less.main)
				.pipe(less())
				.pipe(autoprefixer({
					browsers: ['Chrome > 0', 'ff > 0', 'ie > 0', 'Opera > 0', 'iOS > 0', 'Android > 0']
				}))
				.pipe(gulp.dest(files.less.dest));
});

gulp.task('js', ()=>{
	return gulp.src(files.js.src)
				.pipe(gulp.dest(files.js.dest))
				.pipe(uglify())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(files.js.dest));
});

gulp.task('lib', ()=>{
	return gulp.src(files.lib.src)
				.pipe(gulp.dest(files.lib.dest));
});

gulp.task('image', ()=>{
	return gulp.src(files.image.src)
				.pipe(imagemin())
				.pipe(gulp.dest(files.image.dest));
});

gulp.task('clean', ()=>{
	return del([files.base.dest]);
});

gulp.task('watch', ()=>{
	gulp.watch(files.html.src, ['html']);
	gulp.watch(files.less.src, ['less']);
	gulp.watch(files.js.src, ['js']);
	gulp.watch(files.image.src, ['image']);
	gulp.watch(files.base.destAll, browserSync.reload);
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
	gulpSequence('clean', ['html', 'less', 'js', 'lib', 'image'], ['watch', 'server'])(cb);
});

gulp.task('default', ['build']);











