'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ContactStatistic', 'ContactGroupStatistic', 'GroupSettingsService',
            function (ContactStatistic, ContactGroupStatistic, GroupSettingsService) {
                var ctrl = this;

                ctrl.statistics = ContactStatistic.get(function () {
                    ContactGroupStatistic.setStatistic(ctrl.statistics.statistic);
                    ctrl.numberOfContacts = ContactGroupStatistic.getNumberOfContacts();
                    ctrl.expandHelp = ctrl.numberOfContacts === 0;
                });

                ctrl.newGroup = function () {
                    GroupSettingsService.addGroup().then(function (groupName) {
                        ctrl.statistics.statistic.push({type: groupName, count: 0});
                        ContactGroupStatistic.setStatistic(ctrl.statistics.statistic);
                    });
                };

                ctrl.removedContact = function () {
                    ctrl.numberOfContacts = ContactGroupStatistic.getNumberOfContacts();
                };
            }];
    }
};

