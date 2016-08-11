// =============================================================================
// Config
// =============================================================================


app.config(['RestangularProvider', (RestangularProvider) => {

    // Setup Restangular
    // =========================================================================
    // We set the base URL but also provide empty keys that we set in `run()`.

    let baseApiUrl = 'http://todo.boomchinchilla.com/api/';
    if (window.location.hostname === 'localhost') {
        baseApiUrl = 'http://todo.app/api/';
    }

    RestangularProvider
        .setBaseUrl(baseApiUrl)
    ;


}]);
