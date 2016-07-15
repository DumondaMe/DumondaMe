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
            },
            templateUrl: 'app/modules/recommendation/popularOverview/sideNavFilter/template.html'
        };
    }],
    name: 'elyRecommendationPopularSideNavFilter'
};
