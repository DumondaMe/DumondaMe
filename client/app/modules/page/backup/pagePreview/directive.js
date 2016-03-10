'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                videoHeight: '@',
                videoWidth: '@',
                pagePreview: '='
            },
            templateUrl: 'app/modules/page/pagePreview/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPagePreview'
};
