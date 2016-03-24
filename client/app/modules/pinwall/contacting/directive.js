'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                contacting: '='
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/contacting/template.html'
        };
    }],
    name: 'elyPinwallContacting'
};
