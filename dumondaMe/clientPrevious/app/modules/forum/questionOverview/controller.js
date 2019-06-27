'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ScrollRequest', 'ForumPopularQuestion', 'ForumQuestionScrollRequestResponseHandler',
            function (ScrollRequest, ForumPopularQuestion, ForumQuestionScrollRequestResponseHandler) {
                var ctrl = this;
                ctrl.overview = {question: []};

                ScrollRequest.reset('PopularQuestion', ForumPopularQuestion.get, ForumQuestionScrollRequestResponseHandler);

                ctrl.nextOverview = function () {
                    ScrollRequest.nextRequest('PopularQuestion', ctrl.overview.question).then(function (overview) {
                        ctrl.overview = overview;
                    });
                };

                ctrl.questionRemoved = function (index) {
                    ctrl.overview.question.splice(index, 1);
                };

                ctrl.nextOverview();

                ctrl.commands.addQuestion = function (question) {
                    ctrl.overview.question.unshift(question);
                };
            }];
    }
};

