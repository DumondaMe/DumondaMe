'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                videoHeight: '@',
                videoWidth: '@',
                containerMaxWidth: '@',
                title: '@',
                notRequestInitService: '@',
                hide: '=',
                service: '=',
                pageRequestStart: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/pagePreviewContainer/template.html'
        };
    }],
    name: 'elyPagePreviewContainer'
};
