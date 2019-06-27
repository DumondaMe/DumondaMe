'use strict';

module.exports = ['$scope', 'ElyModal', 'Privacy', 'PrivacySettingService', 'errorToast',
    function ($scope, ElyModal, Privacy, PrivacySettingService, errorToast) {
        var ctrl = this, originalSettings;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.setUploadStarted = function (uploadStarted) {
            ctrl.uploadStarted = uploadStarted;
            if(angular.isFunction(ctrl.uploadStartedEvent)) {
                ctrl.uploadStartedEvent(uploadStarted);
            }
        };
        ctrl.setUploadStarted(true);

        $scope.settings = Privacy.get({}, function () {
            ctrl.setUploadStarted(false);
            originalSettings = angular.copy($scope.settings);
            ctrl.groupNames = PrivacySettingService.getGroupNames($scope.settings.group, $scope.settings.noContact.profileVisible);
            ctrl.groupNamesProfileVisible = ['Alle', 'Nur Kontakte'];
        });

        ctrl.profileVisibleChanged = function (selected) {
            $scope.settings = PrivacySettingService.setPrivacySettingProfileVisible($scope.settings, selected);
            ctrl.groupNames = PrivacySettingService.getGroupNames($scope.settings.group, $scope.settings.noContact.profileVisible);
        };

        ctrl.upload = function () {
            ctrl.setUploadStarted(true);
            var newSettings = {
                changePrivacySetting: {
                    group: $scope.settings.group,
                    noContact: $scope.settings.noContact
                }
            };
            Privacy.save(newSettings, function () {
                ctrl.setUploadStarted(false);
                originalSettings = angular.copy($scope.settings);
                ctrl.uploadDisabled = true;
                if (!ctrl.notHideFinish) {
                    ElyModal.hide();
                }
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetreten!');
                ctrl.setUploadStarted(false);
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
