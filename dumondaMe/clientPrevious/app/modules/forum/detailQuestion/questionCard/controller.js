'use strict';

module.exports = ['$state', 'ForumDeleteQuestion',
    function ($state, ForumDeleteQuestion) {
        var ctrl = this;

        ctrl.goToQuestionOverview = function () {
            if (ctrl.question.questionId) {
                $state.go('forum.question.detail', {questionId: ctrl.question.questionId});
            }
        };

        ctrl.deleteQuestion = function (questionId) {
            ForumDeleteQuestion.delete(ctrl.question.description, questionId, ctrl).then(function () {
                $state.go('forum.question');
            }).catch(ForumDeleteQuestion.errorHandling);
        };
    }];

