'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/viewPort/preview/template.html'
        };
    }],
    name: 'elyNotificationPreviewVersion'
};
