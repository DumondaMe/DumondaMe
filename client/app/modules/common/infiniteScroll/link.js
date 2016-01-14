'use strict';


module.exports = {
    directiveLink: function () {
        return function (scope, elm) {
            var raw = elm[0];

            elm.bind('scroll', function () {
                if ((raw.scrollTop * 1.2 ) + raw.offsetHeight >= raw.scrollHeight) {
                    return scope.$apply(scope.elyInfiniteScroll);
                }
            });
        };
    }
};
