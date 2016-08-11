// =============================================================================
// Gulp Options
// =============================================================================


var config = {

    /**
     * Compiled files location.
     *
     * @type  {String}
     */
    buildDirectory: 'public',

    /**
     * Show system notifcations from Gulp.
     *
     * @type  {Boolean}
     */
    showNotifcations: false,

    /**
     * Source files location.
     *
     * @type  {String}
     */
    sourceDirectory: 'src',

    /**
     * Project's supported browsers.
     *
     * @see   https://github.com/ai/browserslist#queries
     * @type  {Array}
     */
    supportedBrowser: [
        'iOS 8'
    ]

};

module.exports = config;
