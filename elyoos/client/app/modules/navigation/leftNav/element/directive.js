'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                state: '@',
                baseState: '@',
                icon: '@',
                description: '@',
                count: '='
            },
            templateUrl: 'app/modules/navigation/leftNav/element/template.html',
            controllerAs: 'ctrl',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyLeftNavElement'
};
