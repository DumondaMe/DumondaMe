'use strict';

var sendUpdatePrivacySetting = function (Privacy, $scope, updatePrivacySetting, privacySettings) {

    Privacy.save(updatePrivacySetting, function () {
        if (updatePrivacySetting.changePrivacyNoContactSetting) {
            angular.copy($scope.selectedType, $scope.privacySettings.noContact);
        } else {
            angular.forEach($scope.privacySettings.normal, function (privacy) {
                if (privacy.type === $scope.selectedType.type) {
                    privacy.profileVisible = privacySettings.profileVisible;
                    privacy.profileDataVisible = privacySettings.profileDataVisible;
                    privacy.imageVisible = privacySettings.imageVisible;
                    privacy.contactsVisible = privacySettings.contactsVisible;
                }
            });
        }
        angular.copy($scope.selectedType, $scope.originalSelectedType);
        $scope.disableChangePrivacy = true;
    }, function () {

    });
};

module.exports = ['$scope', 'Privacy', function ($scope, Privacy) {

    $scope.allowedToChangePrivacy = false;
    $scope.selectedType = {};
    $scope.addingPrivacy = {};
    $scope.originalSelectedType = {};
    $scope.privacySettings = Privacy.get({}, function () {
        $scope.setPrivacyTypeNoContact();
    });
    $scope.privacySettings.noContactSelected = true;

    $scope.setPrivacyType = function (type) {
        $scope.privacySettings.noContactSelected = false;

        angular.forEach($scope.privacySettings.normal, function (privacySetting) {
            if (privacySetting.type === type) {
                angular.copy(privacySetting, $scope.selectedType);
                angular.copy($scope.selectedType, $scope.originalSelectedType);
            }
        });
    };

    $scope.setPrivacyTypeNoContact = function () {
        $scope.privacySettings.noContactSelected = true;
        angular.copy($scope.privacySettings.noContact, $scope.selectedType);
        $scope.selectedType.type = 'kein Kontakt';
        angular.copy($scope.selectedType, $scope.originalSelectedType);
    };

    $scope.$watch('selectedType', function (newSelectedType) {
        if (newSelectedType) {
            $scope.disableChangePrivacy = angular.equals($scope.selectedType, $scope.originalSelectedType);
        }
    }, true);

    $scope.updatePrivacyType = function () {
        if (!$scope.disableChangePrivacy) {
            var updatePrivacySetting, privacySettings;

            privacySettings = {
                privacySettings: {
                    profileVisible: $scope.selectedType.profileVisible,
                    profileDataVisible: $scope.selectedType.profileDataVisible,
                    imageVisible: $scope.selectedType.imageVisible,
                    contactsVisible: $scope.selectedType.contactsVisible
                }
            };

            if ($scope.privacySettings.noContactSelected) {
                updatePrivacySetting = {};
                updatePrivacySetting.changePrivacyNoContactSetting = privacySettings;
            } else {
                updatePrivacySetting = {};
                updatePrivacySetting.changePrivacySetting = privacySettings;
                updatePrivacySetting.changePrivacySetting.privacyDescription = $scope.selectedType.type;
            }

            sendUpdatePrivacySetting(Privacy, $scope, updatePrivacySetting, privacySettings.privacySettings);
        }
    };

    $scope.showAddingNewPrivacySetting = function () {
        $scope.showNewPrivacySettingInput = true;
        $scope.addingPrivacy.newPrivacyName = "";
    };

    $scope.abortAddingNewPrivacy = function () {
        $scope.showNewPrivacySettingInput = false;
    };

    $scope.addPrivacySetting = function () {
        if ($scope.addingPrivacy.newPrivacyName.trim() !== '') {
            var newPrivacyData = {
                addNewPrivacy: {
                    privacySettings: {
                        profileVisible: true,
                        profileDataVisible: false,
                        imageVisible: false,
                        contactsVisible: false
                    },
                    privacyDescription: $scope.addingPrivacy.newPrivacyName
                }
            };

            Privacy.save(newPrivacyData, function () {
                $scope.showNewPrivacySettingInput = false;
                $scope.privacySettings.normal.push({
                    profileVisible: true,
                    profileDataVisible: false,
                    imageVisible: false,
                    contactsVisible: false,
                    type: $scope.addingPrivacy.newPrivacyName
                });
                $scope.setPrivacyType($scope.addingPrivacy.newPrivacyName);
            });
        }
    };
}];
