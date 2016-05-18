'use strict';

module.exports = ['$state', 'Categories', 'ForumDeleteQuestion',
    function ($state, Categories, ForumDeleteQuestion) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

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

