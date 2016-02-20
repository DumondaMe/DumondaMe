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
                isGroupThread: '=',
                threadId: '=',
                messageSent: '='

            },
            templateUrl: 'app/modules/messages/conversation/createMessage/template.html'
        };
    }],
    name: 'elyConversationCreateMessage'
};
