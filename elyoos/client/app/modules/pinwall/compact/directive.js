'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                pinwall: '=',
                breakpoint: '@'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/compact/template.html'
        };
    }],
    name: 'elyPinwallCompact'
};
