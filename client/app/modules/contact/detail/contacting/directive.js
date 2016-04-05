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
                detail: '=',
                showDetail: '='
            },
            templateUrl: 'app/modules/contact/detail/contacting/template.html'
        };
    }],
    name: 'elyUserDetailContactingPreview'
};
