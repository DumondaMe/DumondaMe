'use strict';

var controller = require('./controller');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/directives/imageCropper/template.html',
            scope: {},
            bindToController: {
                commands: '=',
                imageResultData: '=',
                originalSize: '=',
                ratio: '@',
                minRatio: '@',
                maxRatio: '@',
                minHeight: '@',
                minWidth: '@'
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyImageCropper'
};
