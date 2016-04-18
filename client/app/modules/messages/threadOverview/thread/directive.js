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
                thread: '=',
                lastElement: '='
            },
            templateUrl: 'app/modules/messages/threadOverview/thread/template.html'
        };
    }],
    name: 'elyMessagesThread'
};
