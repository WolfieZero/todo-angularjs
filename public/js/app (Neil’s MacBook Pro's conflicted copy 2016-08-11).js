// =============================================================================
// App
// =============================================================================


// Module
// =============================================================================

var app = angular.module('app', [
    'templates',
    'ui.router',
    'restangular',
    'underdash',
    'mb-dragToReorder'
]);


// Run
// =============================================================================

app.run([
    '$rootScope',
    function ($rootScope) {

        $rootScope.user_id = 1;

    }
]);

// =============================================================================
// Config
// =============================================================================


app.config(['RestangularProvider', function (RestangularProvider) {

    // Setup Restangular
    // =========================================================================
    // We set the base URL but also provide empty keys that we set in `run()`.

    var baseApiUrl = 'http://todo.boomchinchilla.com/api/';
    if (window.location.hostname === 'localhost') {
        baseApiUrl = 'http://todo.app/api/';
    }

    RestangularProvider
        .setBaseUrl(baseApiUrl);


}]);

// =============================================================================
// Routes
// =============================================================================

app.config([
    '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

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

// =============================================================================
// Todos Controller
// =============================================================================


app.controller('TodosController', [
    '$rootScope', '$scope', 'Todo',
    function ($rootScope, $scope, Todo) {

        /**
         * Set the scope locally.
         * @type  {Object}
         */
        var $s = $scope;

        /**
         * Add todo to list.
         * @return  {void}
         */
        $s.addTodo = function () {
            var todo = {
                task: $s.newTodo,
                user_id: 1,
                order: $s.todos.length
            };
            $s.newTodo = '';
            $s.todos.push(todo);
            Todo.post(todo);
        };



        $s.delete = function (key) {
            if (confirm('Delete this todo?')) {
                console.log('deleted', key);
                // Todo.doDELETE(scope.todo.id);
                $s.todos.splice(key);
            }
        };

        /**
         * React to the todo list being dragged and dropped.
         */
        $s.$on('dragToReorder.reordered', function ($event, reordered) {
            var updatedTodo = {
                task: reordered.item.task,
                user_id: reordered.item.user_id,
                order: reordered.to - 1
            }
            // _.forEach(reordered, key)
            Todo.customPUT(updatedTodo, reordered.item.id);
            return console.log(reordered);
        });

        /**
         * Get the todo list.
         */
        Todo.get('all').then(function (todos) {
            $s.todos = todos;
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
        templateUrl: 'todos/todo.html',
        scope: {
            todo: '=value'
        },
        link: function(scope, element) {

            scope.todo.edit = false;

            element.on('dblclick', function () {
                scope.$apply(function () {
                    scope.todo.edit = true;
                });
            });

            element.bind('focusout', function () {
                scope.$apply(function () {
                    scope.todo.edit = false;
                });
            });

            /**
             * Watch for `todo.complete` changes.
             */
            scope.$watch('todo.complete', function (newValue, oldValue) {
                if (scope.todo.complete == '1') {
                    scope.todo.complete = true;
                } else {
                    scope.todo.complete = false;
                }

                if (newValue !== oldValue && oldValue !== 0 && oldValue !== 1) {
                    var updatedTodo = {
                        task: scope.todo.task,
                        user_id: $rootScope.user_id,
                        complete: ((scope.todo.complete) ? '1' : '0')
                    };
                    Todo.customPUT(updatedTodo, scope.todo.id);
                }
            });

            /**
             * Watch for `todo.task` changes.
             */
            scope.$watch('todo.task', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var updatedTodo = {
                        task: newValue,
                        user_id: $rootScope.user_id,
                        complete: ((scope.todo.complete) ? '1' : '0')
                    };
                    Todo.customPUT(updatedTodo, scope.todo.id);
                }
            });

            /**
             * Watch for on focus changes.
             * If `todo.edit` is `true` then we need to focus on input field.
             */
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
}]);

// =============================================================================
// Todos Model
// =============================================================================


app.factory('Todo', [
    'Restangular', function (Restangular) {
        var service = Restangular.all('todo');
        return service;
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
    .factory('helper', function() {
        return window._;
    }
);

//# sourceMappingURL=app.js.map
