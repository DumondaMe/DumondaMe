'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                id: '@',
                elyTitle: '@',
                period: '@'
            },
            templateUrl: 'app/modules/recommendation/popularOverview/column/template.html'
        };
    }],
    name: 'elyRecommendationPopularColumn'
};
