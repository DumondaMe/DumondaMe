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
        $scope.$broadcast('ely.send.button.success');
    }, function () {

    });
};

module.exports = ['$scope', 'Privacy', 'SettingLeftNavElements', function ($scope, Privacy, SettingLeftNavElements) {

    $scope.allowedToChangePrivacy = false;
    $scope.selectedType = {};
    $scope.addingPrivacy = {};
    $scope.privacySettings = Privacy.get({}, function () {
        $scope.setPrivacyTypeNoContact();
    });
    $scope.privacySettings.noContactSelected = true;

    $scope.$emit(SettingLeftNavElements.event, SettingLeftNavElements.elements);

    $scope.setPrivacyType = function (type) {
        $scope.privacySettings.noContactSelected = false;

        angular.forEach($scope.privacySettings.normal, function (privacySetting) {
            if (privacySetting.type === type) {
                angular.copy(privacySetting, $scope.selectedType);
                $scope.$broadcast('ely.send.button.model.changed', $scope.selectedType);
            }
        });
    };

    $scope.setPrivacyTypeNoContact = function () {
        $scope.privacySettings.noContactSelected = true;
        angular.copy($scope.privacySettings.noContact, $scope.selectedType);
        $scope.selectedType.isInit = true;
        $scope.$broadcast('ely.send.button.model.changed', $scope.selectedType);
        $scope.selectedType.type = 'kein Kontakt';
    };


    $scope.updatePrivacyType = function () {
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
                $scope.$broadcast('ely.send.button.success');
            });
        }
    };
}];
