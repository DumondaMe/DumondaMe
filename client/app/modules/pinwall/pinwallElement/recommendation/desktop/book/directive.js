'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '=',
                requestRunning: '='
            },
            controller: function () {
            },
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/pinwallElement/recommendation/desktop/book/template.html'
        };
    }],
    name: 'elyPinwallRecommendationDesktopBook'
};
