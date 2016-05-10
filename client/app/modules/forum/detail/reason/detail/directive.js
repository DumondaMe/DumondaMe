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
            },
            templateUrl: 'app/modules/problem/detail/reason/detail/template.html'
        };
    }],
    name: 'elyProblemReasonDetail'
};
