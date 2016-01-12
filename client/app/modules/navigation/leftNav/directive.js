'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/navigation/leftNav/template.html',
            controllerAs: 'ctrl',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNav'
};
