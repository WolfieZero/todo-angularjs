// =============================================================================
// Signup Controller
// =============================================================================


app.controller('SignupController', [
    '$scope', '$state', '$auth', 'Restangular',
    ($scope, $state, $auth, Restangular) => {

        let $s = $scope;

        $s.signup = () => {
            let credentials = {
                name: $s.name,
                email: $s.email,
                password: $s.password
            };

            Restangular.all('auth/signup').post(credentials).then(() => {
                $auth.login(credentials).then((response) => {
                    Restangular.setDefaultRequestParams({ token: response.data.token });
                    $state.go('todo', {});
                });
            }, () => {
                alert('Cannot create user "' + credentials.email + '"');
            });
        };

    }
]);
