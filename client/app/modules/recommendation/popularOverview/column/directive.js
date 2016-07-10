'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/recommendation/popularOverview/column/template.html'
        };
    }],
    name: 'elyRecommendationPopularColumn'
};
