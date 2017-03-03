'use strict';

module.exports = ['$scope', 'PrivacySettingService',
    function ($scope, PrivacySettingService) {
        var ctrl = this, initial = true;

        ctrl.selectedGroups = [];
        ctrl.previousSelectedGroups = [];

        $scope.$watchCollection('settings', function (newSettings) {
            if (newSettings && angular.isArray(newSettings.normal) && initial) {
                initial = false;
                ctrl.selectedGroups = PrivacySettingService.getSelectedGroups(newSettings, ctrl.propertyName);
            }
        });

        ctrl.changeData = function () {
            ctrl.selectedGroups = PrivacySettingService.handlingGroupSelection(ctrl.selectedGroups, ctrl.previousSelectedGroups);
            ctrl.previousSelectedGroups = angular.copy(ctrl.selectedGroups);
        };
    }];

