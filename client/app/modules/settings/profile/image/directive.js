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
                profile: '='
            },
            templateUrl: 'app/modules/settings/profile/image/template.html'
        };
    }],
    name: 'elySettingsProfileImage'
};
