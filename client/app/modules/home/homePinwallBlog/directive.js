'use strict';

var controller = require('./controller.js');
var link = require('./link.js');

module.exports = {
    directive: ['$animate', function ($animate) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                showExpand: '=',
                isExpand: '='
            },
            link: link.directiveLink($animate),
            controller: controller.directiveCtrl(),
            templateUrl: 'app/modules/home/homePinwallBlog/template.html'
        };
    }],
    name: 'elyHomePinwallBlog'
};
