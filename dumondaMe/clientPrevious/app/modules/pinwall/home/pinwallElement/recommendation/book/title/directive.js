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
            templateUrl: 'app/modules/pinwall/home/pinwallElement/recommendation/book/title/template.html'
        };
    }],
    name: 'elyPinwallRecommendationBookTitle'
};
