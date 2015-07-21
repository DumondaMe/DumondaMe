'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                element: '='
            },
            controller: controller.directiveCtrl(),
            templateUrl: 'app/modules/home/homePinwallElement/template.html'
        };
    }],
    name: 'elyHomePinwallElement'
};
