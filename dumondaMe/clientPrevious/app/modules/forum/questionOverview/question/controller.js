'use strict';

module.exports = ['$state', 'countFormatter', 'Topics', 'ForumDeleteQuestion',
    function ($state, countFormatter, Topics, ForumDeleteQuestion) {
        var ctrl = this;

        ctrl.element.activityRating = countFormatter.getCount(ctrl.element.activityRating);

        ctrl.getTopic = Topics.getTopic;
        
        ctrl.deleteQuestion = function (questionId) {
            ForumDeleteQuestion.delete(ctrl.element.description, questionId, ctrl).then(function () {
                ctrl.removeQuestion(ctrl.index);
            }).catch(ForumDeleteQuestion.errorHandling);
        };

        ctrl.openDetail = function (questionId) {
            $state.go('forum.question.detail', {
                questionId: questionId
            });
        };
    }];

