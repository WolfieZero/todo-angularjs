// =============================================================================
// Gulpfile
// =============================================================================


// Required dependencies
// =============================================================================

var angularTemplatecache = require('gulp-angular-templatecache');
var autoprefixer         = require('gulp-autoprefixer');
var browserSync          = require('browser-sync');
var buble                = require('gulp-buble');
var buffer               = require('vinyl-buffer');
var csso                 = require('gulp-csso');
var commonjs             = require('rollup-plugin-commonjs');
var concat               = require('gulp-concat');
var config               = require('./config.gulp.js');
var gulp                 = require('gulp');
var gutil                = require('gulp-util');
var htmlmin              = require('gulp-htmlmin');
var imagemin             = require('gulp-imagemin');
var nodeResolve          = require('rollup-plugin-node-resolve');
var pngquant             = require('imagemin-pngquant');
var rollup               = require('rollup-stream');
var sass                 = require('gulp-sass');
var source               = require('vinyl-source-stream');
var sourcemaps           = require('gulp-sourcemaps');


// Functions
// =============================================================================

/**
 * Show errors in a prettier way.
 *
 * @param   {Object}  error
 * @return  {void}
 */

var onError = function(error) {
    gutil.log(gutil.colors.red(error.message));
    this.emit('end');
};

/**
 * Return the Rollup options object.
 *
 * @see     https://github.com/rollup/rollup/wiki/JavaScript-API#rolluprollup-options-
 * @param   {String}  path  Folder location from source directory
 * @param   {String}  file  File we are looking at
 * @return  {Object}
 */
var rollupOptions = function(path, file) {
    return {
        entry: config.sourceDirectory + '/' + path + '/' + file,
        format: 'iife',
        moduleName: file,
        sourceMap: true,
        plugins: [
            nodeResolve({
                browser: true
            }),
            commonjs({
                include: [
                    'node_modules/**',
                    config.sourceDirectory + '/' + path + '/**',
                    config.buildDirectory + '/bower/**'
                ]
            }),
            buble()
        ]
    };
};


// Task: Compile app source files
// =============================================================================

gulp.task('app', () => {

    return gulp.src([
        config.sourceDirectory + '/app/app.js',
        config.sourceDirectory + '/app/config.js',
        config.sourceDirectory + '/app/router.js',
        config.sourceDirectory + '/app/**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(buble())
            .on('error', onError)
        .pipe(concat('app.js'))
            .on('error', onError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildDirectory + '/js'));

});


// Task: Browser Sync
// =============================================================================

gulp.task('browsersync', () => {

    /**
     * Browser Sync options.
     *
     * @see   https://www.browsersync.io/docs/options
     * @type  {Object}
     */
    var browserSyncOptions = {
            notify: config.showNotifcations,
            open: false,
            server: {
                baseDir: config.buildDirectory,
                files: config.buildDirectory + '/**/*'
            }
        };

    browserSync.init(browserSyncOptions);
});


// Task: Compiles SCSS to CSS
// =============================================================================

gulp.task('sass', () => {

    /**
     * Autoprefixer options.
     *
     * @see   https://github.com/sindresorhus/gulp-autoprefixer#api
     * @type  {Object}
     */
    var autoprefixerOptions = {
            browsers: config.supportedBrowsers
        };

    /**
     * CSSO Options.
     *
     * @see   https://github.com/ben-eb/gulp-csso#api
     * @type  {Object}
     */
    var cssoOptions = {
            restructure: false
        };

    /**
     * gulp-sass options based on node-sass.
     *
     * @see   https://github.com/sass/node-sass#options
     * @type  {Object}
     */
    var sassOptions = {
            includePaths: [
                'node_modules',
                'public/bower'
            ],
            outputStyle: 'compressed',
            precision: '2'
        };

    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
            .on('error', onError)
        .pipe(autoprefixer(autoprefixerOptions))
            .on('error', onError)
        .pipe(csso(cssoOptions))
            .on('error', onError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.buildDirectory + '/css'));

});


// Task: Caches the HTML
// =============================================================================

gulp.task('html', () => {

    /**
     * ng-template options.
     *
     * @see   https://github.com/teambition/gulp-ng-template#options
     * @type  {Object}
     */
    var angularTemplatecacheOptions = {
            standalone: true
        };

    /**
     * HTML Min options based on HTMLMinifier.
     *
     * @see   https://github.com/kangax/html-minifier#options-quick-reference
     * @type  {Object}
     */
    var htmlminOptions = {
            collapseWhitespace: true,
            removeComments: true
        };

    return gulp.src(config.sourceDirectory + '/app/**/*.html')
        .pipe(sourcemaps.init())
        .pipe(htmlmin(htmlminOptions))
            .on('error', onError)
        .pipe(angularTemplatecache('templates.js', angularTemplatecacheOptions))
            .on('error', onError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.buildDirectory + '/js'));

});


// Task: Compile library files
// =============================================================================

gulp.task('lib', () => {

    return rollup(rollupOptions('lib', 'lib.js'))
        .on('error', onError)
        .pipe(source('lib.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.buildDirectory + '/js'));

});


// Task: Performs lossless compression on images in public folder
// =============================================================================

gulp.task('image', () => {

    return gulp.src(config.buildDirectory + '/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.buildDirectory + '/images'));

});


// Task: Watch for changes
// =============================================================================

gulp.task('watch', ['build'], () => {

    // Styling
    gulp.watch([config.sourceDirectory + '/sass/**/*.scss'], ['sass']);

    // Javascript
    gulp.watch([config.sourceDirectory + '/app/**/*.js'], ['app']);
    gulp.watch([config.sourceDirectory + '/lib/**/*.js'], ['lib']);

    // HTML
    gulp.watch([config.sourceDirectory + '/app/**/*.html'], ['html']);

    // Images
    gulp.watch([config.buildDirectory + '/images/**/*.*'], ['image']);

    gulp.watch([
        config.buildDirectory + '/js/app.js',
        config.buildDirectory + '/js/lib.js',
        config.buildDirectory + '/js/templates.js',
        config.buildDirectory + '/css/app.css',
        config.buildDirectory + '/index.html'
    ]).on('change', browserSync.reload);

});


// Task: build
// =============================================================================

gulp.task('build', [
    'app',
    'html',
    'image',
    'lib',
    'sass'
]);


// Task: Watch files and run a local server
// =============================================================================

gulp.task('serve', [
    'browsersync',
    'watch'
]);


// Task: Default
// =============================================================================

gulp.task('default', ['build']);
