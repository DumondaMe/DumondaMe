'use strict';

module.exports = ['$scope', 'Privacy', function ($scope, Privacy) {

    $scope.renameType = $scope.privacy.type;
    $scope.renameExists = true;

    $scope.renamePrivacySetting = function () {
        var renamePrivacySettings = {
            renamePrivacy: {
                privacyDescription: $scope.privacy.type,
                newPrivacyDescription: $scope.renameType
            }
        };

        Privacy.save(renamePrivacySettings, function () {
            if ($scope.selectedType.type === $scope.privacy.type) {
                $scope.selectedType.type = $scope.renameType;
            }
            angular.forEach($scope.privacySettings.normal, function (privacySetting) {
                if (privacySetting.type === $scope.privacy.type) {
                    privacySetting.type = $scope.renameType;
                }
            });
            $scope.privacy.type = $scope.renameType;
        }, function () {

        });
    };

    $scope.$watch('renameType', function (newRenameType) {
        if (newRenameType) {
            $scope.renameExists = false;
            angular.forEach($scope.privacySettings.normal, function (privacySetting) {
                if (privacySetting.type === newRenameType) {
                    $scope.renameExists = true;
                }
            });
        }
    });
}];
