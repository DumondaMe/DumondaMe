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
            controller: function () {
            },
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/compact/pinwallElement/template.html'
        };
    }],
    name: 'elyPinwallCompactElementCard'
};
