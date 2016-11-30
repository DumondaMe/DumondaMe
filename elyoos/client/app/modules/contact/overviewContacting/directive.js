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
            bindToController: {},
            templateUrl: 'app/modules/contact/overviewContacting/template.html'
        };
    }],
    name: 'elyContactingOverview'
};
