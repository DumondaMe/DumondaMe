'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '='
            },
            controller: controller.directiveCtrl(),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/home/pinwallElement/recommendation/template.html'
        };
    }],
    name: 'elyPinwallRecommendation'
};
