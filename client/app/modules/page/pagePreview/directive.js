'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                pages: '='
            },
            templateUrl: 'app/modules/page/pagePreview/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPagePreview'
};
