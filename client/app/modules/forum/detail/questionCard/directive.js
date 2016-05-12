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
                question: '='
            },
            templateUrl: 'app/modules/forum/detail/questionCard/template.html'
        };
    }],
    name: 'elyForumQuestionDetailQuestionCard'
};
