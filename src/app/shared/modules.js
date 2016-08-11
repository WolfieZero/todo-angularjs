// =============================================================================
// Shared Modules
// =============================================================================


// Lodash / Underscore
// =============================================================================
// See: https://lodash.com/docs
// See: http://underscorejs.org/

const underdash = angular
    .module('underdash', [])
    .factory('_', function() {
        return window._;
    }
);
