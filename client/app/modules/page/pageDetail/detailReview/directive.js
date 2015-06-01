'use strict';

var controller = require('./controller.js');

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
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPageReview'
};
