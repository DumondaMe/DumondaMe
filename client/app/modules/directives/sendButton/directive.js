'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                buttonDescription: '@',
                errorPlacement: '@',
                sendData: '=',
                model: '='
            },
            templateUrl: 'app/modules/directives/sendButton/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySendButton'
};
