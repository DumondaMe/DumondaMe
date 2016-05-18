'use strict';

module.exports = ['$state', 'countFormatter', 'Categories', 'ForumDeleteQuestion',
    function ($state, countFormatter, Categories, ForumDeleteQuestion) {
        var ctrl = this;

        ctrl.element.activityRating = countFormatter.getCount(ctrl.element.activityRating);

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;
        
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

