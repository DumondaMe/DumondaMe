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
                group: '=',
                title: '@',
                openEdit: '='
            },
            templateUrl: 'app/modules/settings/modal/overviewGroupSettings/group/template.html'
        };
    }],
    name: 'elySettingsPrivacyGroup'
};
