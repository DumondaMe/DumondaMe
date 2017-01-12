'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '='
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/pinwallElement/recommendation/template.html'
        };
    }],
    name: 'elyPinwallRecommendation'
};
