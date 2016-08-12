// =============================================================================
// Login Controller
// =============================================================================


app.controller('LoginController', [
    '$scope', '$state', '$auth', 'Restangular',
    ($scope, $state, $auth, Restangular) => {

        let $s = $scope;

        $s.login = () => {
            let credentials = {
                email: $s.email,
                password: $s.password
            }

            $auth.login(credentials).then(() => {

                let credentials = {
                    email: $s.email,
                    password: $s.password
                };

                $auth.login(credentials).then((response) => {
                    Restangular.setDefaultRequestParams({ token: response.data.token });
                    $state.go('todo', {});
                });
            });
        };

    }
]);
