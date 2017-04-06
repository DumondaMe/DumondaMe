'use strict';

module.exports = ['RecommendedContactScrollRequest', 'RecommendedUserOnHomeSetting',
    function (RecommendedContactScrollRequest, RecommendedUserOnHomeSetting) {
        var ctrl = this;

        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();

        ctrl.contactSuggestionOnHome = function (showOnHomeScreen) {
            RecommendedUserOnHomeSetting.save({showOnHomeScreen: showOnHomeScreen}, function () {
                ctrl.users.showUserRecommendation = showOnHomeScreen;
            });
        };

        ctrl.contactAdded = function () {
            ctrl.users = {recommendedUser: []};
            RecommendedContactScrollRequest.reset();
            ctrl.nextContactRecommendations();
        };

        ctrl.nextContactRecommendations = function () {
            RecommendedContactScrollRequest.nextRequest(ctrl.users.recommendedUser).then(function (recommendedUsers) {
                ctrl.users = recommendedUsers;
            });
        };
        ctrl.nextContactRecommendations();
    }];

