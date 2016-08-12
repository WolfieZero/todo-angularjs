// =============================================================================
// Routes
// =============================================================================

app.config([
    '$stateProvider', '$urlRouterProvider',
    ($stateProvider, $urlRouterProvider) => {

        $urlRouterProvider.otherwise('login');

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginController'
            })

            .state('signup', {
                url: '/signup',
                templateUrl: 'signup/signup.html',
                controller: 'SignupController'
            })

            .state('todo', {
                url: '/todo',
                templateUrl: 'todo/todos.html',
                controller: 'TodoController'
            })

        ;

    }
]);
