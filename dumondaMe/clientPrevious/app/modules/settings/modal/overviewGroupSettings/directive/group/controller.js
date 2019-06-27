'use strict';

module.exports = ['$scope', 'PrivacySettingService',
    function ($scope, PrivacySettingService) {
        var ctrl = this;

        ctrl.selectedGroups = [];
        ctrl.previousSelectedGroups = [];

        $scope.$watchCollection('settings', function (newSettings) {
            if (newSettings && angular.isArray(newSettings.group)) {
                ctrl.selectedGroups = PrivacySettingService.getSelectedGroups(newSettings, ctrl.propertyName);
                ctrl.previousSelectedGroups = angular.copy(ctrl.selectedGroups);
            }
        });

        ctrl.changeData = function () {
            var selectedGroups = PrivacySettingService.handlingGroupSelection(ctrl.selectedGroups, ctrl.previousSelectedGroups);
            $scope.settings = PrivacySettingService.setPrivacySetting($scope.settings, selectedGroups, ctrl.propertyName);
        };
    }];

