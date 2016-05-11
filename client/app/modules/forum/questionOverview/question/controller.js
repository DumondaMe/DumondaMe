'use strict';

module.exports = ['$state', 'countFormatter', 'Categories',
    function ($state, countFormatter, Categories) {
        var ctrl = this;

        ctrl.element.activityRating = countFormatter.getCount(ctrl.element.activityRating);

        ctrl.getCategory = Categories.getCategory;
        ctrl.getCategoryClass = Categories.getCategoryClass;

        ctrl.openDetail = function (questionId) {
            $state.go('forum.question.detail', {
                questionId: questionId
            });
        };
    }];

