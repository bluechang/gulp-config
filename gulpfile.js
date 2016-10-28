
const gulp 			= require('gulp');		
const clean 		= require('gulp-clean');
const less 			= require('gulp-less');
const autoprefixer 	= require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const rename        = require('gulp-rename');
const gulpSequence  = require('gulp-sequence');
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
	 return gulp.src(paths.base.dest, {read: false})
	 			.pipe(clean());
});

gulp.task('html', ()=>{
	 return gulp.src(paths.html.src)
				.pipe(gulp.dest(paths.html.dest));
});

gulp.task('less', ()=>{
	 return gulp.src(paths.less.main)
				.pipe(less())
				.pipe(autoprefixer({
					browsers: ['Chrome > 0', 'ff > 0', 'ie > 0', 'Opera > 0', 'iOS > 0', 'Android > 0']
				}))
				.pipe(gulp.dest(paths.less.dest));
});

gulp.task('js', ()=>{
	 return gulp.src(paths.js.src)
				.pipe(gulp.dest(paths.js.dest))
				.pipe(uglify())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(paths.js.dest));
});

gulp.task('lib', ()=>{
	 return gulp.src(paths.lib.src)
				.pipe(gulp.dest(paths.lib.dest));
});

gulp.task('image', ()=>{
	 return gulp.src(paths.image.src)
				.pipe(imagemin())
				.pipe(gulp.dest(paths.image.dest));
});

gulp.task('watch', ()=>{
	gulp.watch(paths.html.src, ['html']);
	gulp.watch(paths.less.src, ['less']);
	gulp.watch(paths.js.src, ['js']);
	gulp.watch(paths.image.src, ['image']);
	gulp.watch(paths.base.srcAll, browserSync.reload);
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


