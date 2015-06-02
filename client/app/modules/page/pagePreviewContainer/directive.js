'use strict';

var link = require('./link.js');
var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                longFormat: '@',
                videoHeight: '@',
                videoWidth: '@',
                title: '@',
                notRequestInitService: '@',
                hide: '=',
                service: '=',
                serviceParameter: '='
            },
            link: link.directiveLink(),
            controller: controller.directiveCtrl(),
            templateUrl: 'app/modules/page/pagePreviewContainer/template.html'
        };
    }],
    name: 'elyPagePreviewContainer'
};
