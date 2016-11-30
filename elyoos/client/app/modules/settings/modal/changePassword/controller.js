'use strict';

module.exports = ['Password', 'ElyModal', 'errorToast', 'CheckChangePasswordService',
    function (Password, ElyModal, errorToast, CheckChangePasswordService) {
        var ctrl = this;

        ctrl.uploadValid = false;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.changePassword = function () {
            ctrl.running = true;
            Password.save({
                newPassword: ctrl.newPassword,
                actualPassword: ctrl.oldPassword
            }, function () {
                ElyModal.hide();
            }, function () {
                errorToast.showError('Altes Passwort stimmt nicht überein.');
                ctrl.uploadValid = false;
                ctrl.running = false;
            });
        };

        ctrl.newPasswordChanged = function () {
            ctrl.uploadValid = CheckChangePasswordService.checkNewPasswordIsValid(ctrl.newPassword, ctrl.confirmNewPassword);

            ctrl.changePasswordForm.newPassword.$setValidity('ely-min-length', true);
            ctrl.changePasswordForm.newPassword.$setValidity('ely-char-missing', true);
            ctrl.changePasswordForm.confirmNewPassword.$setValidity('ely-compare', true);
            if (!ctrl.uploadValid) {
                if (!CheckChangePasswordService.checkMinPasswordLength(ctrl.newPassword)) {
                    ctrl.changePasswordForm.newPassword.$setValidity('ely-min-length', false);
                } else if (!CheckChangePasswordService.checkRequiredChar(ctrl.newPassword)) {
                    ctrl.changePasswordForm.newPassword.$setValidity('ely-char-missing', false);
                } else if (!CheckChangePasswordService.checkNewPasswordEqual(ctrl.newPassword, ctrl.confirmNewPassword)) {
                    ctrl.changePasswordForm.confirmNewPassword.$setValidity('ely-compare', false);
                }
            }
        };

        ctrl.confirmNewPasswordChanged = function () {
            ctrl.uploadValid = CheckChangePasswordService.checkNewPasswordIsValid(ctrl.newPassword, ctrl.confirmNewPassword);

            ctrl.changePasswordForm.confirmNewPassword.$setValidity('ely-compare', true);
            if (!ctrl.uploadValid) {
                if (!CheckChangePasswordService.checkNewPasswordEqual(ctrl.newPassword, ctrl.confirmNewPassword)) {
                    ctrl.changePasswordForm.confirmNewPassword.$setValidity('ely-compare', false);
                }
            }
        };

    }];

