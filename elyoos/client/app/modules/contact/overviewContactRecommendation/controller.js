'use strict';

module.exports = ['ContactRecommendation', 'RecommendedUserOnHomeSetting', 'ArrayHelper',
    function (ContactRecommendation, RecommendedUserOnHomeSetting, ArrayHelper) {
        var ctrl = this;
        ctrl.users = ContactRecommendation.get();

        ctrl.contactSuggestionOnHome = function (showOnHomeScreen) {
            RecommendedUserOnHomeSetting.save({showOnHomeScreen: showOnHomeScreen}, function () {
                ctrl.users.showUserRecommendation = showOnHomeScreen;
            });
        };

        ctrl.contactAdded = function (userId) {
            ArrayHelper.removeElement(ctrl.users.recommendedUser, 'userId', userId);
        };
    }];

