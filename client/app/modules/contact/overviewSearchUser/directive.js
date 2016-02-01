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
                users: '='
            },
            templateUrl: 'app/modules/contact/overviewSearchUser/template.html'
        };
    }],
    name: 'elyContactSearchUserOverview'
};
