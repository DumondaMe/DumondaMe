'use strict';

var link = require('./link.js');
var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            link: link.directiveLink(),
            controller: controller.directiveCtrl(),
            templateUrl: 'app/modules/home/homePinwallContainer/template.html'
        };
    }],
    name: 'elyHomePinwallContainer'
};
