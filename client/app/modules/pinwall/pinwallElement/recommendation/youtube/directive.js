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
            templateUrl: 'app/modules/pinwall/pinwallElement/recommendation/youtube/template.html'
        };
    }],
    name: 'elyPinwallRecommendationYoutube'
};
