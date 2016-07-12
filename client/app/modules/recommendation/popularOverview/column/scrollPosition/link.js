'use strict';


module.exports = {
    directiveLink: function () {
        return function (scope, elm) {

            var raw = elm[0];

            elm.bind('scroll', function () {
                scope.$apply(function () {
                    scope.scrollPosition(raw.scrollTop, raw.scrollHeight);
                });
            });
        };
    }
};
