'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/page/userRecommendation/template.html'
        };
    }],
    name: 'elyPageUserRecommendation'
};
