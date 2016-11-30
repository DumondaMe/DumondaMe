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
                user: '=',
                addedContactEvent: '='
            },
            templateUrl: 'app/modules/contact/contactPreviewSquare/template.html'
        };
    }],
    name: 'elyContactPreviewSquare'
};
