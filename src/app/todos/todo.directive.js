// =============================================================================
// Task Directive
// =============================================================================


app.directive('todo', [
    '$rootScope', '$timeout', 'Todo',
    ($rootScope, $timeout, Todo) => {
    return {
        restrict: 'E',
        templateUrl: 'todos/todo.html',
        scope: {
            todo: '=value'
        },
        link: function(scope, element) {

            scope.todo.edit = false;

            scope.editThis = () => {
                scope.$apply(function () {
                    scope.todo.edit = true;
                });
            }

            element.on('click', scope.editThis);

            element.bind('focusout', () => {
                scope.$apply(function () {
                    scope.todo.edit = false;
                });
            });

            /**
             * Watch for `todo.complete` changes.
             */
            scope.$watch('todo.complete', (newValue, oldValue) => {
                if (scope.todo.complete == '1') {
                    scope.todo.complete = true;
                } else {
                    scope.todo.complete = false;
                }

                if (newValue !== oldValue && oldValue !== 0 && oldValue !== 1) {
                    let updatedTodo = {
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
            scope.$watch('todo.task', (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    let updatedTodo = {
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
                    $timeout(() => {
                        // Yeah, I'm cheating here...
                        // TODO Use correct selection method
                        let input = element[0].children[1].children[0];
                        input.focus();
                        input.select();
                    });
                }
            });

        }
    };
}]);
