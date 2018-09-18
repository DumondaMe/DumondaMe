'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function () {
            },
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/home/overviewFeedback/template.html'
        };
    }],
    name: 'elyHomeOverviewFeedback'
};