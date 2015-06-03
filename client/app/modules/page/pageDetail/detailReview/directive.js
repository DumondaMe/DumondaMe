'use strict';

var controller = require('./controller.js');
var link = require('./link.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                onlyContacts: '@',
                title: '@'
            },
            templateUrl: 'app/modules/page/pageDetail/detailReview/template.html',
            link: link.directiveLink(),
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPageReview'
};
