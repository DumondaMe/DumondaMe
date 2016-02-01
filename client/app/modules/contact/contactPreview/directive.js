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
                title: '=',
                count: '='
            },
            templateUrl: 'app/modules/contact/contactPreview/template.html'
        };
    }],
    name: 'elyContactPreview'
};
