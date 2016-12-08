'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                commands: '=',
                numberOfFeedback: '=',
                status: '@'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/feedback/overviewGroup/container/template.html'
        };
    }],
    name: 'elyFeedbackOverviewGroupContainer'
};
