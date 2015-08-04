'use strict';

var link = require('./link');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                size: '@'
            },
            templateUrl: 'app/modules/directives/spin/template.html',
            link: link.directiveLink()
        };
    }],
    name: 'elySpin'
};
