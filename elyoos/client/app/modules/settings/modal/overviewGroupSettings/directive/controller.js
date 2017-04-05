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
            ctrl.groupNames = PrivacySettingService.getGroupNames($scope.settings.group, $scope.settings.noContact.profileVisible);
            ctrl.groupNamesProfileVisible = ['Alle', 'Nur Kontakte'];
        });

        ctrl.profileVisibleChanged = function (selected) {
            $scope.settings = PrivacySettingService.setPrivacySettingProfileVisible($scope.settings, selected);
            ctrl.groupNames = PrivacySettingService.getGroupNames($scope.settings.group, $scope.settings.noContact.profileVisible);
        };

        ctrl.upload = function () {
            ctrl.uploadStarted = true;
            var newSettings = {
                changePrivacySetting: {
                    group: $scope.settings.group,
                    noContact: $scope.settings.noContact
                }
            };
            Privacy.save(newSettings, function () {
                ctrl.uploadStarted = false;
                originalSettings = angular.copy($scope.settings);
                ctrl.uploadDisabled = true;
                if (!ctrl.notHideFinish) {
                    ElyModal.hide();
                }
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetreten!');
                ctrl.uploadStarted = false;
            });
        };

        $scope.$watchCollection('settings', function (newSettings) {
            if (newSettings && angular.isArray(newSettings.group)) {
                ctrl.uploadDisabled = angular.equals(newSettings, originalSettings);
                if (!ctrl.uploadDisabled && ctrl.instantUpdate) {
                    ctrl.upload();
                }
            }
        });
    }];
