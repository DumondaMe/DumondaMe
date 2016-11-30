'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller,
            controllerAs: 'ctrl',
            bindToController: {
                setting: '=',
                abort: '=',
                finish: '='
            },
            templateUrl: 'app/modules/settings/modal/modifyGroupSettings/directive/template.html'
        };
    }],
    name: 'elyModifyPrivacyGroup'
};
