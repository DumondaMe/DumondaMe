'use strict';

module.exports = ['$state', 'dateFormatter', 'UserDetailNavigation', 'RecommendationTypes',
    function ($state, dateFormatter, UserDetailNavigation, RecommendationTypes) {
        var ctrl = this, test = 1;

        ctrl.requestRunning = false;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.getRecommendationType = RecommendationTypes.getRecommendationType;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.thisRecommendationByUser);
        };
    }];

