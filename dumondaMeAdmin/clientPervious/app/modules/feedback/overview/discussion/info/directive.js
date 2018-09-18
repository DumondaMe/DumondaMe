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
                discussion: '='
            },
            templateUrl: 'app/modules/feedback/overview/discussion/info/template.html'
        };
    }],
    name: 'elyFeedbackDiscussionInfo'
};
