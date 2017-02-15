'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                recommendedUser: '=',
                reloadPinwall: '='
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/home/recommendedUser/template.html'
        };
    }],
    name: 'elyPinwallRecommendedUser'
};
