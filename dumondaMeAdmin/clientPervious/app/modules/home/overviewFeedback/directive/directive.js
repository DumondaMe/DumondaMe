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
            bindToController: {
                hideTitle: '='
            },
            templateUrl: 'app/modules/home/overviewFeedback/directive/template.html'
        };
    }],
    name: 'elyHomeOverviewFeedbackDirective'
};
