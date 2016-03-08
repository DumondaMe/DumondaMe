'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                pinwall: '=',
                gap: '='
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/template.html'
        };
    }],
    name: 'elyPinwall'
};
