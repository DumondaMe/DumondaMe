'use strict';

module.exports = ['RecommendedContactScrollRequest', 'RecommendedUserOnHomeSetting', 'ArrayHelper',
    function (RecommendedContactScrollRequest, RecommendedUserOnHomeSetting, ArrayHelper) {
        var ctrl = this;

        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();

        ctrl.contactSuggestionOnHome = function (showOnHomeScreen) {
            RecommendedUserOnHomeSetting.save({showOnHomeScreen: showOnHomeScreen}, function () {
                ctrl.users.showUserRecommendation = showOnHomeScreen;
            });
        };

        ctrl.contactAdded = function (userId) {
            ArrayHelper.removeElement(ctrl.users.recommendedUser, 'userId', userId);
        };

        ctrl.nextContactRecommendations = function () {
            RecommendedContactScrollRequest.nextRequest(ctrl.users.recommendedUser).then(function (recommendedUsers) {
                ctrl.users = recommendedUsers;
            });
        };
        ctrl.nextContactRecommendations();
    }];

