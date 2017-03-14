'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/vision/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js'),
            bindToController: {showPreviewImage: '='}
        };
    }],
    name: 'elyVision'
};
