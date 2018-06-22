const autoprefix 	= require("gulp-autoprefixer");
const concat 		= require("gulp-concat");
const gulp 			= require("gulp");
const pug 			= require("gulp-pug");
const stylus 		= require("gulp-stylus");
const uglify 		= require("gulp-uglify");

gulp.task('pug', function() {
	return gulp.src('src/pug/pages/**/*.pug')
	.pipe(pug())
	.pipe(gulp.dest('dist/'));
})

gulp.task('styl', function() {
	return gulp.src('src/styl/pages/*.styl')
	.pipe(stylus({
		compress: true
	}))
	.pipe(autoprefix({
		cascade: false
	}))
	.pipe(gulp.dest('dist/assets/css'));
})

gulp.task('js', function() {
	return gulp.src('src/js/*.js')
	.pipe(concat('scripts.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/assets/js'))
})

gulp.task('default', ['pug', 'styl', 'js'], function () {
	gulp.watch(['src/pug/**/*.pug', 'src/styl/**/*.styl', 'src/js/*.js'], ['pug', 'styl', 'js']);
})