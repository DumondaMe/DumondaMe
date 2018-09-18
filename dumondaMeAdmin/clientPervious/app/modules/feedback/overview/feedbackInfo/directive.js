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
                feedback: '='
            },
            templateUrl: 'app/modules/feedback/overview/feedbackInfo/template.html'
        };
    }],
    name: 'elyFeedbackInfo'
};
