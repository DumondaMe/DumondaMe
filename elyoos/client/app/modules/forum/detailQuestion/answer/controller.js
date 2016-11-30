'use strict';

module.exports = ['$state', 'ForumDeleteAnswer',
    function ($state, ForumDeleteAnswer) {
        var ctrl = this;

        ctrl.openAnswerDetail = function () {
            $state.go('forum.answer.detail', {answerId: ctrl.answer.answerId});
        };

        ctrl.deleteAnswer = function (answerId, title) {
            ForumDeleteAnswer.delete(title, answerId, ctrl).then(function () {
                ctrl.removedAnswer(ctrl.index);
            }).catch(ForumDeleteAnswer.errorHandling);
        };
    }];

