'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                element: '=',
                showBottomLine: '@'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/userRecommendation/pinwallElement/directive/template.html'
        };
    }],
    name: 'elyUserPinwallRecommendation'
};
