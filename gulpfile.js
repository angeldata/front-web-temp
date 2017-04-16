const gulp = require('gulp');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const uglifyjs = require('gulp-uglifyjs');
const browserSync = require('browser-sync');
const del = require('del');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngQuant = require('imagemin-pngquant');
const gcmq = require('gulp-group-css-media-queries');

gulp.task('smart-grid', function() {

    const smartgrid = require('smart-grid');

    const settings = {
        outputStyle: 'styl', /* less || scss || sass || styl */
        columns: 12, /* number of grid columns */
        offset: "30px", /* gutter width px || % */
        container: {
            maxWidth: '1200px', /* max-width оn very large screen */
            fields: '30px' /* side fields */
        },
        breakPoints: {
            lg: {
                'width': '1100px', /* -> @media (max-width: 1100px) */
                'fields': '30px' /* side fields */
            },
            md: {
                'width': '960px',
                'fields': '15px'
            },
            sm: {
                'width': '780px',
                'fields': '15px'
            },
            xs: {
                'width': '560px',
                'fields': '15px'
            }
            /*
            We can create any quantity of break points.

            some_name: {
                some_width: 'Npx',
                some_offset: 'N(px|%)'
            }
            */
        }
    };

    smartgrid('app/stylus', settings);

});

gulp.task('img', function() {

    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()]
        }))
        .pipe(gulp.dest('dist/img'));

})

gulp.task('styl', function() {

    return gulp.src('app/stylus/main.styl')
        .pipe(stylus())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gcmq())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));

});

gulp.task('browser-sync', function() {

    browserSync({
        server: {baseDir: 'app'},
        notify: false
    });

});

gulp.task('clean', function() {

    return del('dist');

});

gulp.task('watch', ['styl', 'browser-sync'],function() {

    gulp.watch('app/stylus/**/*.styl', ['styl']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);

});

gulp.task('build', ['clean', 'styl', 'img'],function() {

    let buildCss = gulp.src('app/css/main.css')
        .pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src(['app/fonts/**/*', '!app/fonts/**/*.css'])
        .pipe(gulp.dest('dist/fonts'));

    let buildJs = gulp.src('app/js/**/*')
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest('dist/js'));

    let buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'))

});

gulp.task('default', ['watch']);
