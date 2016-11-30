'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./../column/controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                id: '@',
                period: '@'
            },
            templateUrl: 'app/modules/recommendation/popularOverview/columnMobile/template.html'
        };
    }],
    name: 'elyRecommendationPopularColumnMobile'
};
