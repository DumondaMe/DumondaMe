'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/imageCropper/template.html',
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
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyImageCropper'
};
