'use strict';

module.exports = {
    directiveLink: function ($animate) {
        return function (scope, element) {
            $animate.enabled(element, false);
        };
    }
};
