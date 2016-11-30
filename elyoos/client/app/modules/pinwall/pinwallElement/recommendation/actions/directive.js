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
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/pinwallElement/recommendation/actions/template.html'
        };
    }],
    name: 'elyPinwallPageRecommendationActions'
};
