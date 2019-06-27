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
                answer: '='
            },
            templateUrl: 'app/modules/forum/detailQuestion/answer/rating/template.html'
        };
    }],
    name: 'elyForumAnswerRating'
};
