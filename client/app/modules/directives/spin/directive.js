'use strict';

var link = require('./link');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/directives/spin/template.html',
            link: link.directiveLink()
        };
    }],
    name: 'elySpin'
};
