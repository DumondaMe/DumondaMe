'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                feedback: '=',
                group: '@'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/feedback/overviewGroup/element/template.html'
        };
    }],
    name: 'elyFeedbackOverviewGroupElement'
};
