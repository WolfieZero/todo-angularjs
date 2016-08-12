// =============================================================================
// Task Directive
// =============================================================================


app.directive('todo', [
    '$rootScope', '$timeout', 'Todo',
    ($rootScope, $timeout, Todo) => {
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

                scope.editThis = () => {
                    scope.todo.edit = true;
                };


                // On focus out we set `edit` to false.
                // =============================================================

                element.bind('focusout', () => {
                    scope.$apply(function () {
                        scope.todo.edit = false;
                    });
                });


                // Watch for `todo.complete` changes.
                // =============================================================

                scope.$watch('todo.complete', (newValue, oldValue) => {
                    if (scope.todo.complete == '1') {
                        scope.todo.complete = true;
                    } else {
                        scope.todo.complete = false;
                    }

                    if (newValue !== oldValue && oldValue !== 0 && oldValue !== 1) {
                        let updatedTodo = {
                            task: scope.todo.task,
                            complete: ((scope.todo.complete) ? '1' : '0')
                        };
                        Todo.doPUT(updatedTodo, scope.todo.id);
                    }
                });


                // Watch for `todo.task` changes.
                // =============================================================

                scope.$watch('todo.task', (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        let updatedTodo = {
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
    }
]);
