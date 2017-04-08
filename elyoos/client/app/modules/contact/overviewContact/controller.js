'use strict';

module.exports = ['$scope', 'ContactStatistic', 'ContactGroupStatistic', 'GroupSettingsService', 'ContactGroupStatisticUpdate',
    function ($scope, ContactStatistic, ContactGroupStatistic, GroupSettingsService, ContactGroupStatisticUpdate) {
        var ctrl = this;

        ctrl.statistic = ContactGroupStatistic.getStatistic();
        ctrl.numberOfContacts = ContactGroupStatistic.getNumberOfContacts();
        if (ctrl.statistic) {
            ctrl.expandHelp = ctrl.numberOfContacts === 0;
        } else {
            ctrl.statistic = [];
        }
        ContactGroupStatistic.register('overviewContact', ctrl);

        ctrl.newGroup = function () {
            GroupSettingsService.addGroup().then(function (groupName) {
                ContactGroupStatistic.addGroup(groupName);
            });
        };

        ctrl.groupStatisticChanged = function () {
            ContactGroupStatisticUpdate.update(ctrl.statistic, ContactGroupStatistic.getStatistic());
            ctrl.numberOfContacts = ContactGroupStatistic.getNumberOfContacts();
            ctrl.expandHelp = ctrl.numberOfContacts === 0;
        };

        $scope.$on("$destroy", function () {
            ContactGroupStatistic.deregister('overviewContact');
        });
    }];

