'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {orderBy: '='},
            bindToController: {
                commands: '=',
                addedComment: '&'
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/feedback/detail/comments/template.html'
        };
    }],
    name: 'elyFeedbackDetailComment'
};
