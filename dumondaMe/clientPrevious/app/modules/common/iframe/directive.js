'use strict';

var link = require('./link');

module.exports = {
    directive: ['$sce', function ($sce) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/iframe/template.html',
            scope: {
                secureLink: '@',
                width: '@',
                height: '@',
                src: '='
            },
            link: link.directiveLink($sce)
        };
    }],
    name: 'elyIframe'
};
