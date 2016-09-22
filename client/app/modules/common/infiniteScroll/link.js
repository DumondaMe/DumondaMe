'use strict';


module.exports = {
    directiveLink: function () {
        return function (scope, elm) {
            var raw = elm[0];

            elm.bind('scroll', function () {
                if (angular.isFunction(scope.scrollPosition)) {
                    scope.$apply(function () {
                        scope.scrollPosition(raw.scrollTop, raw.scrollHeight);
                    });
                }
                if ((raw.scrollTop * 1.5 ) + raw.offsetHeight >= raw.scrollHeight &&
                    (angular.isArray(scope.elyInfiniteScroll) || angular.isFunction(scope.elyInfiniteScroll))) {
                    return scope.$apply(function () {
                        if (angular.isFunction(scope.elyInfiniteScroll)) {
                            scope.elyInfiniteScroll();
                        } else {
                            angular.forEach(scope.elyInfiniteScroll, function (callback) {
                                if (angular.isFunction(callback)) {
                                    callback();
                                }
                            });
                        }
                    });
                }
            });
        };
    }
};
