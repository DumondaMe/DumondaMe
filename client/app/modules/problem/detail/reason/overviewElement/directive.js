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
                element: '=',
                sortRequest: '&'
            },
            templateUrl: 'app/modules/problem/detail/reason/overviewElement/template.html'
        };
    }],
    name: 'elyProblemReasonOverviewElement'
};
