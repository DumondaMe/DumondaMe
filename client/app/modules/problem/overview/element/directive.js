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
                element: '='
            },
            templateUrl: 'app/modules/problem/overview/element/template.html'
        };
    }],
    name: 'elyProblemOverviewElement'
};
