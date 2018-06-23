const concat        = require("gulp-concat");
const gulp          = require("gulp");
const pug           = require("gulp-pug");
const stylus        = require("gulp-stylus");

gulp.task('pug', () => {
    return gulp.src('src/pug/index.pug')
        .pipe(pug())
        .pipe(gulp.dest('dist/'));
})

gulp.task('styl', () => {
    return gulp.src('src/styl/index.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest('dist/assets/css'));
})

gulp.task('js', () => {
    return gulp.src('src/js/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist/assets/js'))
})

gulp.task('default', ['pug', 'styl', 'js'], () => {
    gulp.watch(['src/pug/**/*.pug', 'src/styl/**/*.styl', 'src/js/*.js'], ['pug', 'styl', 'js']);
})