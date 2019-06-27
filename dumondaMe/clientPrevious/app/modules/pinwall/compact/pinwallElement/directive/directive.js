'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '=',
                showBottomLine: '@'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/compact/pinwallElement/directive/template.html'
        };
    }],
    name: 'elyPinwallCompactElement'
};
