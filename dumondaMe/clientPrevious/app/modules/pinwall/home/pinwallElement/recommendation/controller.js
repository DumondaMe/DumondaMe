'use strict';

module.exports = ['dateFormatter', 'UserDetailNavigation', 'RecommendationTypes',
    function (dateFormatter, UserDetailNavigation, RecommendationTypes) {
        var ctrl = this;

        ctrl.requestRunning = false;
        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
        ctrl.getRecommendationType = RecommendationTypes.getRecommendationType;

        ctrl.openUserDetail = function () {
            UserDetailNavigation.openUserDetail(ctrl.element.userId, ctrl.element.thisRecommendationByUser);
        };
    }];

