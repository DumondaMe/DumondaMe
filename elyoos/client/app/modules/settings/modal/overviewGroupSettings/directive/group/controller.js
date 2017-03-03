'use strict';

module.exports = ['$scope', 'PrivacySettingService',
    function ($scope, PrivacySettingService) {
        var ctrl = this;

        ctrl.selectedGroups = [];
        ctrl.previousSelectedGroups = [];

        $scope.$watchCollection('settings', function (newSettings) {
            if (newSettings && angular.isArray(newSettings.group)) {
                ctrl.selectedGroups = PrivacySettingService.getSelectedGroups(newSettings, ctrl.propertyName);
            }
        });

        ctrl.changeData = function () {
            ctrl.selectedGroups = PrivacySettingService.handlingGroupSelection(ctrl.selectedGroups, ctrl.previousSelectedGroups);
            ctrl.previousSelectedGroups = angular.copy(ctrl.selectedGroups);
            if (!angular.isFunction(ctrl.profileVisibleChanged)) {
                $scope.settings = PrivacySettingService.setPrivacySetting($scope.settings, ctrl.selectedGroups, ctrl.propertyName);
            }
        };

        ctrl.menuClosed = function () {
            if (angular.isFunction(ctrl.profileVisibleChanged)) {
                ctrl.profileVisibleChanged(ctrl.selectedGroups);
            }
        };
    }];

