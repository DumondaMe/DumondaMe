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
            templateUrl: 'app/modules/filter/sideNavFilter/template.html'
        };
    }],
    name: 'elyBlogRecommendationSideNavFilter'
};
