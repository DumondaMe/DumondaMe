'use strict';

module.exports = ['$state', 'Categories',
    function ($state, Categories) {
        var ctrl = this;

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.goToQuestionOverview = function () {
            if (ctrl.question.questionId) {
                $state.go('forum.question.detail', {questionId: ctrl.question.questionId});
            }
        };
    }];

