'use strict';

var link = require('./link');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/directives/imageCropper/template.html',
            scope: {
                reset: '=',
                image: '=',
                imageResultData: '=',
                ratio: '@'
            },
            link: link.directiveLink()
        };
    }],
    name: 'elyImageUpload'
};
