'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            templateUrl: 'app/modules/navigation/leftNav/container/template.html',
            controllerAs: 'ctrl',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNavContainer'
};
