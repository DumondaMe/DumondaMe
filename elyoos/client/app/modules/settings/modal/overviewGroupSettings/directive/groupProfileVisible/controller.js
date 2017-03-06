'use strict';

module.exports = ['$scope', 'PrivacySettingService',
    function ($scope, PrivacySettingService) {
        var ctrl = this;

        ctrl.selectedGroups = [];
        ctrl.previousSelectedGroups = [];

        $scope.$watchCollection('settings', function (newSettings) {
            if (newSettings && angular.isArray(newSettings.group)) {
                ctrl.selectedGroups = PrivacySettingService.getSelectedProfileVisible(newSettings);
            }
        });

        ctrl.changeData = function () {
            ctrl.selectedGroups = PrivacySettingService.handlingProfileVisibleSelection(ctrl.selectedGroups, ctrl.previousSelectedGroups);
            ctrl.previousSelectedGroups = angular.copy(ctrl.selectedGroups);
        };

        ctrl.menuClosed = function () {
            ctrl.profileVisibleChanged(ctrl.selectedGroups);
        };
    }];

