'use strict';

module.exports = ['$scope', 'Privacy', 'ContactGroupStatistic',
    function ($scope, Privacy, ContactGroupStatistic) {
        var ctrl = this;

        //Statistic has been loaded with first userInfo request.
        ctrl.statistic = ContactGroupStatistic.getStatistic();
        ctrl.selectedGroup = ctrl.statistic[0];
        ContactGroupStatistic.register('setupAccountContactGroup', ctrl);

        ctrl.deleteGroup = function (groupName) {
            if (ctrl.statistic.length > 1) {
                if (groupName === ctrl.selectedGroup.group) {
                    ctrl.statistic.forEach(function (statistic) {
                        if (statistic.group !== groupName && ctrl.selectedGroup.group === groupName) {
                            ctrl.selectedGroup = statistic;
                        }
                    });
                }
                return Privacy.delete({
                    privacyDescription: groupName,
                    newPrivacyDescription: ctrl.selectedGroup.group
                }).$promise.then(function () {
                    ContactGroupStatistic.removeGroup(groupName, ctrl.selectedGroup.group);
                });
            }
        };

        ctrl.groupStatisticChanged = function () {
            ctrl.statistic = ContactGroupStatistic.getStatistic();
        };

        ctrl.setSelectedGroup = function (statistic) {
            ctrl.selectedGroup = statistic;
        };

        $scope.$on("$destroy", function () {
            ContactGroupStatistic.deregister(ctrl);
        });
    }];
