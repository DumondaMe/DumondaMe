'use strict';


module.exports = {
    directiveLink: function ($timeout, $window) {
        return function (scope, elem) {
            var w = angular.element($window);

            $timeout(function () {
                scope.elyHeight(elem.height());
            }, 0);

            w.bind('resize', function () {
                scope.elyHeight(elem.height());
            });
        };
    }
};
