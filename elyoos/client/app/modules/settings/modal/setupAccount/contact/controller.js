'use strict';

module.exports = ['RecommendedContactScrollRequest', 'ContactStatistic', 'ContactStatisticTypes', 'GroupSettingsService',
    function (RecommendedContactScrollRequest, ContactStatistic, ContactStatisticTypes, GroupSettingsService) {
        var ctrl = this;

        ctrl.users = {recommendedUser: []};
        RecommendedContactScrollRequest.reset();

        ctrl.statistics = ContactStatistic.get(function () {
            ContactStatisticTypes.setStatistic(ctrl.statistics.statistic);
        });

        ctrl.newGroup = function () {
            GroupSettingsService.addGroup().then(function (groupName) {
                ctrl.statistics.statistic.push({type: groupName, count: 0});
            });
        };

        ctrl.nextContactRecommendations = function () {
            RecommendedContactScrollRequest.nextRequest(ctrl.users.recommendedUser).then(function (recommendedUsers) {
                ctrl.users = recommendedUsers;
            });
        };
        ctrl.nextContactRecommendations();
    }];
