'use strict';

var controller = require('./controller.js');
var link = require('./link.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                maxHeight: '@'
            },
            templateUrl: 'app/modules/directives/expandText/template.html',
            controller: controller.directiveCtrl(),
            link: link.directiveLink()
        };
    }],
    name: 'elyExpandText'
};
