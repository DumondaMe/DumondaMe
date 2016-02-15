'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ContactStatistic', 'ContactStatisticTypes', 'GroupSettingsService',
            function (ContactStatistic, ContactStatisticTypes, GroupSettingsService) {
                var ctrl = this;

                ctrl.statistics = ContactStatistic.get(function () {
                    ContactStatisticTypes.setStatistic(ctrl.statistics.statistic);
                });

                ctrl.newGroup = function () {
                    GroupSettingsService.addGroup().then(function (groupName) {
                        ctrl.statistics.statistic.push({type: groupName, count: 0});
                    });
                };
            }];
    }
};

