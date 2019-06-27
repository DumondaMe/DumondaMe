'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
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
