'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                commands: '=',
                breakpoint: '@'
            },
            templateUrl: 'app/modules/settings/profile/userPinwall/template.html'
        };
    }],
    name: 'elySettingsUserPinwall'
};
