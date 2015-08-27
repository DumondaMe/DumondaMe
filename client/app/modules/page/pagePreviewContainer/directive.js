'use strict';

var link = require('./link.js');
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
                containerWidth: '@',
                title: '@',
                notRequestInitService: '@',
                hide: '=',
                service: '=',
                pageRequestStart: '='
            },
            link: link.directiveLink(),
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/pagePreviewContainer/template.html'
        };
    }],
    name: 'elyPagePreviewContainer'
};
