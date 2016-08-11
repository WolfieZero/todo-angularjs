// =============================================================================
// Todos Controller
// =============================================================================


app.controller('TodosController', [
    '$rootScope', '$scope', '_', 'Todo',
    ($rootScope, $scope, _, Todo) => {

        /**
         * Set the scope locally.
         * @type  {Object}
         */
        let $s = $scope;

        /**
         * Add todo to list.
         * @return  {void}
         */
        $s.addTodo = () => {
            let todo = {
                task: $s.newTodo,
                user_id: 1,
                order: $s.todos.length
            };
            $s.newTodo = '';
            Todo.post(todo).then((newTodo) => {
                $s.todos.push(newTodo);
            });
        };

        /**
         * Delete the todo item.
         */
        $s.delete = (key) => {
            if (confirm('Delete "' + $s.todos[key].task + '"?')) {
                Todo.doDELETE($s.todos[key].id);
                $s.todos.splice(key, 1);
            }
        };

        /**
         * React to the todo list being dragged and dropped.
         */
        $s.$on('dragToReorder.reordered', ($event, reordered) => {
            let newOrder = [];
            let updatedLists = {};
            _(reordered.array).forEach((value, key) => {
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
        Todo.get('all').then((todos) => {
            $s.todos = todos;
        });

    }
]);
