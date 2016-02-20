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
                message: '='
            },
            templateUrl: 'app/modules/messages/conversation/message/template.html'
        };
    }],
    name: 'elyMessage'
};
