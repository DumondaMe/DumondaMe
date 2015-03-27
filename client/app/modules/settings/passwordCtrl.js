'use strict';

module.exports = ['$scope', 'Password', function ($scope, Password) {

    $scope.password = {};
    $scope.submitFailed = false;
    $scope.submitFailedToServer = false;
    $scope.successUserDataChange = false;

    $scope.submitNewPassword = function () {
        if (!$scope.profileForm.$invalid) {
            $scope.submitFailed = false;

            Password.save({
                newPassword: $scope.password.newPassword,
                actualPassword: $scope.password.actualPassword
            }, function () {
                $scope.profileForm.$setPristine();
                $scope.successUserDataChange = true;
                $scope.submitFailedToServer = false;
            }, function () {
                $scope.submitFailedToServer = true;
                $scope.successUserDataChange = false;
            });
        } else {
            $scope.submitFailed = true;
        }
    };
}];
