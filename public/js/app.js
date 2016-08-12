// =============================================================================
// App
// =============================================================================


// Module
// =============================================================================

var app = angular.module('app', [
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
    function ($rootScope, $state, $auth, Restangular) {

        // Check if authenticated and if so add to params
        // =====================================================================

        if ($auth.isAuthenticated()) {
            Restangular.setDefaultRequestParams({ token: $auth.getToken() });
        }


        // Logout
        // =====================================================================

        $rootScope.logout = function () {
            $auth.logout();
            $state.go('login', {});
        };

    }
]);

// =============================================================================
// Config
// =============================================================================


app.config([
    'RestangularProvider', '$authProvider',
    function (RestangularProvider, $authProvider) {

        var baseApiUrl = 'http://todo.boomchinchilla.com/api/';
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

// =============================================================================
// Routes
// =============================================================================

app.config([
    '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

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

// =============================================================================
// Login Controller
// =============================================================================


app.controller('LoginController', [
    '$scope', '$state', '$auth', 'Restangular',
    function ($scope, $state, $auth, Restangular) {

        var $s = $scope;

        $s.login = function () {
            var credentials = {
                email: $s.email,
                password: $s.password
            }

            $auth.login(credentials).then(function () {

                var credentials = {
                    email: $s.email,
                    password: $s.password
                };

                $auth.login(credentials).then(function (response) {
                    Restangular.setDefaultRequestParams({ token: response.data.token });
                    $state.go('todo', {});
                });
            });
        };

    }
]);

// =============================================================================
// Shared directives
// =============================================================================


// On enter
// =============================================================================

app.directive('onEnter', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.bind('keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.onEnter);
                    });
                }
            });

        }
    };
});

// =============================================================================
// Shared Modules
// =============================================================================


// Lodash / Underscore
// =============================================================================
// See: https://lodash.com/docs
// See: http://underscorejs.org/

var underdash = angular
    .module('underdash', [])
    .factory('_', function() {
        return window._;
    }
);

// =============================================================================
// Signup Controller
// =============================================================================


app.controller('SignupController', [
    '$scope', '$state', '$auth', 'Restangular',
    function ($scope, $state, $auth, Restangular) {

        var $s = $scope;

        $s.signup = function () {
            var credentials = {
                name: $s.name,
                email: $s.email,
                password: $s.password
            };

            Restangular.all('auth/signup').post(credentials).then(function () {
                $auth.login(credentials).then(function (response) {
                    Restangular.setDefaultRequestParams({ token: response.data.token });
                    $state.go('todo', {});
                });
            }, function () {
                alert('Cannot create user "' + credentials.email + '"');
            });
        };

    }
]);

// =============================================================================
// Todos Controller
// =============================================================================


app.controller('TodoController', [
    '$rootScope', '$scope', '$auth', '$state', '_', 'Todo',
    function ($rootScope, $scope, $auth, $state, _, Todo) {

        /**
         * Set the scope locally.
         * @type  {Object}
         */
        var $s = $scope;


        // Check we are authenticated
        // =====================================================================

        if (!$auth.isAuthenticated()) {
            $state.go('login', {});
        }


        // Get the todo list.
        // =====================================================================

        Todo.get('all').then(function (todos) {
            $s.todos = todos;
        });


        // Add todo to list
        // =====================================================================

        $s.addTodo = function () {
            var todo = {
                task: $s.newTodo,
                order: $s.todos.length
            };
            $s.newTodo = '';
            Todo.post(todo).then(function (newTodo) {
                $s.todos.push(newTodo);
            });
        };


        // Delete the todo item.
        // =====================================================================

        $s.delete = function (key) {
            if (confirm('Delete "' + $s.todos[key].task + '"?')) {
                Todo.doDELETE($s.todos[key].id);
                $s.todos.splice(key, 1);
            }
        };


        // React to the todo list being dragged and dropped.
        // =====================================================================

        $s.$on('dragToReorder.reordered', function ($event, reordered) {
            var newOrder = [];
            var updatedLists = {};
            _(reordered.array).forEach(function (value, key) {
                newOrder.push({
                    id: value.id,
                    order: key
                });
            });
            updatedLists = {
                list: JSON.stringify(newOrder)
            };
            Todo.doPUT(updatedLists, 'reorder');
        });

    }
]);

// =============================================================================
// Task Directive
// =============================================================================


app.directive('todo', [
    '$rootScope', '$timeout', 'Todo',
    function ($rootScope, $timeout, Todo) {
        return {
            restrict: 'E',
            templateUrl: 'todo/todo.html',
            scope: {
                todo: '=value'
            },
            link: function(scope, element) {

                /**
                 * Default `edit` value to false
                 *
                 * @type  {Boolean}
                 */
                scope.todo.edit = false;


                // Set `edit` value to true.
                // =============================================================

                scope.editThis = function () {
                    scope.todo.edit = true;
                };


                // On focus out we set `edit` to false.
                // =============================================================

                element.bind('focusout', function () {
                    scope.$apply(function () {
                        scope.todo.edit = false;
                    });
                });


                // Watch for `todo.complete` changes.
                // =============================================================

                scope.$watch('todo.complete', function (newValue, oldValue) {
                    if (scope.todo.complete == '1') {
                        scope.todo.complete = true;
                    } else {
                        scope.todo.complete = false;
                    }

                    if (newValue !== oldValue && oldValue !== 0 && oldValue !== 1) {
                        var updatedTodo = {
                            task: scope.todo.task,
                            complete: ((scope.todo.complete) ? '1' : '0')
                        };
                        Todo.doPUT(updatedTodo, scope.todo.id);
                    }
                });


                // Watch for `todo.task` changes.
                // =============================================================

                scope.$watch('todo.task', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var updatedTodo = {
                            task: newValue,
                            complete: ((scope.todo.complete) ? '1' : '0')
                        };
                        Todo.customPUT(updatedTodo, scope.todo.id);
                    }
                });


                // Watch for on focus changes.
                // =============================================================
                // If `todo.edit` is `true` then we need to focus on input field.

                scope.$watch('todo.edit', function (value) {
                    if (value === true) {
                        $timeout(function () {
                            // Yeah, I'm cheating here...
                            // TODO Use correct selection method
                            var input = element[0].children[1].children[0];
                            input.focus();
                            input.select();
                        });
                    }
                });

            }
        };
    }
]);

// =============================================================================
// Todos Model
// =============================================================================


app.factory('Todo', [
    'Restangular', function (Restangular) {
        var service = Restangular.all('todo');
        return service;
    }
]);

//# sourceMappingURL=app.js.map
