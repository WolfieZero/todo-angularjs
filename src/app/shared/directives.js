// =============================================================================
// Shared directives
// =============================================================================


// On enter
// =============================================================================

app.directive('onEnter', () => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {

            element.bind('keypress', (event) => {
                if (event.which === 13) {
                    scope.$apply(() => {
                        scope.$eval(attrs.onEnter);
                    });
                }
            });

        }
    };
});
