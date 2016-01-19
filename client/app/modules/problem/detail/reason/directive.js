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
                problemDescription: '@'
            },
            templateUrl: 'app/modules/problem/detail/reason/template.html'
        };
    }],
    name: 'elyProblemOverviewReason'
};
