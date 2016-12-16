'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/feedback/overview/template.html'
        };
    }],
    name: 'elyOverviewFeedback'
};
