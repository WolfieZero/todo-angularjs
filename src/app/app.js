// =============================================================================
// App
// =============================================================================


// Module
// =============================================================================

let app = angular.module('app', [
    'mb-dragToReorder',
    'restangular',
    'satellizer',
    'templates',
    'ui.router',
    'underdash'
]);


// Run
// =============================================================================

app.run([
    '$rootScope', '$state', '$auth', 'Restangular',
    ($rootScope, $state, $auth, Restangular) => {

        // Check if authenticated and if so add to params
        // =====================================================================

        if ($auth.isAuthenticated()) {
            Restangular.setDefaultRequestParams({ token: $auth.getToken() });
        }


        // Logout
        // =====================================================================

        $rootScope.logout = () => {
            $auth.logout();
            $state.go('login', {});
        };

    }
]);
