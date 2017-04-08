'use strict';

module.exports = ['$scope', 'Privacy', 'ContactGroupStatistic', 'CheckGroupNameService', 'errorToast',
    function ($scope, Privacy, ContactGroupStatistic, CheckGroupNameService, errorToast) {
        var ctrl = this;

        //Statistic has been loaded with first userInfo request.
        ctrl.statistic = ContactGroupStatistic.getStatistic();
        ctrl.selectedGroup = ctrl.statistic[0];
        ContactGroupStatistic.register('setupAccountContactGroup', ctrl);

        ctrl.deleteGroup = function (groupName) {
            if (ctrl.statistic.length > 1) {
                ctrl.uploadRunning = true;
                if (ctrl.previousGroupName && ctrl.groupToChange) {
                    ctrl.groupToChange.group = ctrl.previousGroupName;
                }
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
                    ctrl.showRenameGroup = false;
                    ctrl.uploadRunning = false;
                });
            }
        };

        ctrl.groupNameChanged = function (groupName, index) {
            var groupNameProperty = index + "groupName";
            ctrl.isAllowedToChange = true;
            ctrl.renameGroupForm[groupNameProperty].$setValidity('ely-max-length', true);
            ctrl.renameGroupForm[groupNameProperty].$setValidity('ely-group-exist', true);

            if (angular.isString(groupName) && groupName.length > 30) {
                ctrl.renameGroupForm[groupNameProperty].$setValidity('ely-max-length', false);
                ctrl.isAllowedToChange = false;
            }
            if (angular.isString(groupName) && groupName.trim() === "") {
                delete ctrl.groupToChange.group;
                ctrl.isAllowedToChange = false;
            }
            if (!CheckGroupNameService.checkNameExists(groupName) && groupName !== ctrl.previousGroupName) {
                ctrl.renameGroupForm[groupNameProperty].$setValidity('ely-group-exist', false);
                ctrl.isAllowedToChange = false;
            }
            if (groupName === ctrl.previousGroupName) {
                ctrl.isAllowedToChange = false;
            }
        };

        ctrl.abortRenameGroup = function () {
            ctrl.showRenameGroup = false;
            ctrl.groupToChange.group = ctrl.previousGroupName;
            delete ctrl.groupToChange;
        };

        ctrl.changeGroupName = function (groupToChange) {
            if (ctrl.previousGroupName && ctrl.groupToChange) {
                ctrl.groupToChange.group = ctrl.previousGroupName;
            }
            ctrl.showRenameGroup = true;
            ctrl.groupToChange = groupToChange;
            ctrl.previousGroupName = angular.copy(groupToChange.group);
        };

        ctrl.changeGroupNameAccept = function () {
            var previousGroup = ctrl.previousGroupName, newGroup = ctrl.groupToChange.group;
            ctrl.uploadRunning = true;
            Privacy.save({
                renamePrivacy: {
                    privacyDescription: previousGroup,
                    newPrivacyDescription: newGroup
                }
            }, function () {
                ctrl.uploadRunning = false;
                ctrl.showRenameGroup = false;
                ContactGroupStatistic.renameGroup(previousGroup, newGroup);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadRunning = false;
            });
        };

        ctrl.groupStatisticChanged = function () {
            ctrl.statistic = ContactGroupStatistic.getStatistic();
        };

        ctrl.setSelectedGroup = function (statistic) {
            ctrl.selectedGroup = statistic;
        };

        ctrl.openNewGroup = function () {
            ctrl.disableNavigation = true;
            ctrl.showAddGroup = true;
        };

        $scope.$on("$destroy", function () {
            ContactGroupStatistic.deregister('setupAccountContactGroup');
        });
    }];
