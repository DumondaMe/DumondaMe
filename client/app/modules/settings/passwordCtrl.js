'use strict';

module.exports = ['$scope', 'Password', 'SettingLeftNavElements', function ($scope, Password, SettingLeftNavElements) {

    $scope.password = {};
    $scope.submitFailed = false;
    $scope.newPasswordNotEqual = false;
    $scope.submitFailedToServer = false;
    $scope.successUserDataChange = false;

    $scope.$emit(SettingLeftNavElements.event, SettingLeftNavElements.elements);

    $scope.submitNewPassword = function () {
        function checkMinPasswordLength() {
            return $scope.password.newPassword.trim().length > 7;
        }

        function checkPasswordEqual() {
            return $scope.password.newPassword === $scope.password.newPasswordConfirm;
        }

        $scope.submitFailed = false;
        $scope.newPasswordNotEqual = false;
        $scope.profileForm.inputPassword.$error.minlength = false;

        if (!$scope.profileForm.$invalid) {
            if (checkMinPasswordLength()) {
                if (checkPasswordEqual()) {
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
                    $scope.newPasswordNotEqual = true;
                    $scope.password.newPasswordConfirm = '';
                }
            } else {
                $scope.profileForm.inputPassword.$error.minlength = true;
                $scope.password.newPasswordConfirm = '';
            }
        } else {
            $scope.submitFailed = true;
            $scope.password.newPasswordConfirm = '';
        }
    };
}];
