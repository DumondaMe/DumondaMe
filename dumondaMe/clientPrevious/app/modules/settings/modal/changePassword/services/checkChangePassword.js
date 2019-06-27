'use strict';

module.exports = [
    function () {

        var service = this;

        service.checkNewPasswordIsValid = function (newPassword, confirmNewPassword) {
            var isValid = false;
            if (service.checkMinPasswordLength(newPassword) && service.checkMinPasswordLength(confirmNewPassword)) {
                if (service.checkRequiredChar(newPassword)) {
                    if (service.checkNewPasswordEqual(newPassword, confirmNewPassword)) {
                        isValid = true;
                    }
                }
            }
            return isValid;
        };

        service.checkRequiredChar = function (password) {
            var isValid = false;
            if (angular.isString(password) && /(?=.*[A-Z])/.test(password) && /(?=.*[0-9])/.test(password)) {
                isValid = true;
            }
            return isValid;
        };

        service.checkMinPasswordLength = function (password) {
            return angular.isString(password) && password.trim().length > 7;
        };

        service.checkNewPasswordEqual = function (newPassword, confirmNewPassword) {
            return newPassword === confirmNewPassword;
        };
    }]
;
