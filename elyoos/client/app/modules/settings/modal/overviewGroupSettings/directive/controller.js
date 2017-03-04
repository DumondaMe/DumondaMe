'use strict';

module.exports = ['$scope', 'ElyModal', 'Privacy', 'PrivacySettingService', 'errorToast',
    function ($scope, ElyModal, Privacy, PrivacySettingService, errorToast) {
        var ctrl = this, originalSettings;
        ctrl.uploadStarted = true;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        $scope.settings = Privacy.get({}, function () {
            ctrl.uploadStarted = false;
            originalSettings = angular.copy($scope.settings);
            ctrl.groupNames = PrivacySettingService.getGroupNames($scope.settings.group);
            ctrl.groupNamesProfileVisible = angular.copy(ctrl.groupNames);
        });

        ctrl.profileVisibleChanged = function (selected) {
            $scope.settings = PrivacySettingService.setPrivacySettingProfileVisible($scope.settings, selected);
            PrivacySettingService.setDisabled($scope.settings, ctrl.groupNames);
        };

        ctrl.upload = function () {
            ctrl.uploadStarted = true;
            let newSettings = {
                changePrivacySetting: {
                    group: $scope.settings.group,
                    noContact: $scope.settings.noContact
                }
            };
            Privacy.save(newSettings, function () {
                ctrl.uploadStarted = false;
                originalSettings = angular.copy($scope.settings);
                ctrl.uploadDisabled = true;
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetreten!');
                ctrl.uploadStarted = false;
            });
        };

        $scope.$watchCollection('settings', function (newSettings) {
            if (newSettings && angular.isArray(newSettings.group)) {
                ctrl.uploadDisabled = angular.equals(newSettings, originalSettings);
            }
        });
    }];
