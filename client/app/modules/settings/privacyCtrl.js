'use strict';

module.exports = ['$scope', 'Privacy', function ($scope, Privacy) {

    $scope.allowedToChangePrivacy = false;
    $scope.selectedType = {};
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
}];
