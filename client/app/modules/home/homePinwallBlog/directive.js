'use strict';

var controller = require('./controller.js');
var link = require('./link.js');

module.exports = {
    directive: ['$animate', '$timeout', function ($animate, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                showExpand: '=',
                isExpand: '=',
                userInfo: '=',
                blogAdded: '='
            },
            link: link.directiveLink($animate, $timeout),
            controller: controller.directiveCtrl(),
            templateUrl: 'app/modules/home/homePinwallBlog/template.html'
        };
    }],
    name: 'elyHomePinwallBlog'
};
