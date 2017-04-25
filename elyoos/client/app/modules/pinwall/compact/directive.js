'use strict';

var link = require('./link.js');

module.exports = {
    directive: ['$animate', function ($animate) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                pinwall: '=',
                breakpoint: '@'
            },
            link: link.directiveLink($animate),
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/compact/template.html'
        };
    }],
    name: 'elyPinwallCompact'
};
