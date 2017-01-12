'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {pinwall: '='},
            bindToController: {
                contacting: '=',
                recommendedUser: '=',
                breakpoint: '@',
                showInfo: '@',
                noPinwall: '=',
                addRemovePinwallElementService: '=',
                reloadPinwall: '='
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/template.html'
        };
    }],
    name: 'elyPinwall'
};
