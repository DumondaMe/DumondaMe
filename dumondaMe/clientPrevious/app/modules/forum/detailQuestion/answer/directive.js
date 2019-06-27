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
                answer: '=',
                index: '=',
                removedAnswer: '='
            },
            templateUrl: 'app/modules/forum/detailQuestion/answer/template.html'
        };
    }],
    name: 'elyForumQuestionAnswerCard'
};
