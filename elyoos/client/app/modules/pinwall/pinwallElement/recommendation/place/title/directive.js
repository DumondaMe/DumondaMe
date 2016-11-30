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
            templateUrl: 'app/modules/pinwall/pinwallElement/recommendation/place/title/template.html'
        };
    }],
    name: 'elyPinwallRecommendationPlaceTitle'
};
