// =============================================================================
// Config
// =============================================================================


app.config([
    'RestangularProvider', '$authProvider',
    (RestangularProvider, $authProvider) => {

        let baseApiUrl = 'http://todo.boomchinchilla.com/api/';
        if (window.location.hostname === 'localhost') {
            baseApiUrl = 'http://todo.app/api/';
        }

        // Setup Restangular
        // =====================================================================

        RestangularProvider
            .setBaseUrl(baseApiUrl)
        ;


        // Setup Auth
        // =====================================================================

        $authProvider.loginUrl = baseApiUrl + 'auth/login';

    }
]);
