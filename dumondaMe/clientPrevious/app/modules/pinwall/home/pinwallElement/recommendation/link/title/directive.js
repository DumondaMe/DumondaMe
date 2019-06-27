'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '='
            },
            controller: function () {
            },
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/home/pinwallElement/recommendation/link/title/template.html'
        };
    }],
    name: 'elyPinwallRecommendationLinkTitle'
};
