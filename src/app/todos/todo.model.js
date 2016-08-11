// =============================================================================
// Todos Model
// =============================================================================


app.factory('Todo', [
    'Restangular', (Restangular) => {
        var service = Restangular.all('todo');
        return service;
    }
]);
