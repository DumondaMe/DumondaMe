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
                detail: '='
            },
            templateUrl: 'app/modules/contact/detail/contact/template.html'
        };
    }],
    name: 'elyUserDetailContactsPreview'
};
