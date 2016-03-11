'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            bindToController: {
                pinwall: '='
            },
            templateUrl: 'app/modules/home/rightSidenav/template.html'
        };
    }],
    name: 'elyHomeRightSidenav'
};
