'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/util/file/uploadCropImage/directive/template.html',
            controllerAs: 'ctrl',
            bindToController: {
                ratio: '@',
                finish: '=',
                uploadUrl: '@',
                running: '=',
                startUploadImage: '='
            },
            controller: require('./../controller.js')
        };
    }],
    name: 'elyUploadCropImage'
};
