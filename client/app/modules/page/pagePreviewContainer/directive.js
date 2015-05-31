'use strict';

var link = require('./link.js');

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
                pagePreviews: '=',
                search: '=',
                totalNumberOfPages: '='
            },
            link: link.directiveLink(),
            templateUrl: 'app/modules/page/pagePreviewContainer/template.html'
        };
    }],
    name: 'elyPagePreviewContainer'
};
