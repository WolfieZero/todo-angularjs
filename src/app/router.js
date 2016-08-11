// =============================================================================
// Routes
// =============================================================================

app.config([
    '$stateProvider', '$urlRouterProvider',
    ($stateProvider, $urlRouterProvider) => {

        $urlRouterProvider.otherwise('/todos');

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginController'
            })

            .state('todos', {
                url: '/todos',
                templateUrl: 'todos/todos.html',
                controller: 'TodosController'
            })

        ;

    }
]);
