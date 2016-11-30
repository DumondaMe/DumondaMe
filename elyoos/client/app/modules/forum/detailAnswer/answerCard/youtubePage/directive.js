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
            bindToController: {
                answer: '='
            },
            templateUrl: 'app/modules/forum/detailAnswer/answerCard/youtubePage/template.html'
        };
    }],
    name: 'elyForumAnswerDetailYoutubePage'
};
