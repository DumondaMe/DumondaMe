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
                element: '=',
                index: '=',
                removeQuestion: '='
            },
            templateUrl: 'app/modules/forum/questionOverview/question/template.html'
        };
    }],
    name: 'elyQuestionOverviewElement'
};
