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
        .setBaseUrl(baseApiUrl)
    ;


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
// Todos Controller
// =============================================================================


app.controller('TodosController', [
    '$rootScope', '$scope', '_', 'Todo',
    function ($rootScope, $scope, _, Todo) {

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
            Todo.post(todo).then(function (newTodo) {
                $s.todos.push(newTodo);
            });
        };

        /**
         * Delete the todo item.
         */
        $s.delete = function (key) {
            if (confirm('Delete "' + $s.todos[key].task + '"?')) {
                Todo.doDELETE($s.todos[key].id);
                $s.todos.splice(key, 1);
            }
        };

        /**
         * React to the todo list being dragged and dropped.
         */
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
                    Todo.doPUT(updatedTodo, scope.todo.id);
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

//# sourceMappingURL=app.js.map
