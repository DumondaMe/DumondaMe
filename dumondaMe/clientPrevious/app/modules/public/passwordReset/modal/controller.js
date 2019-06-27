'use strict';

module.exports = ['$state', 'ResetPassword', 'CheckChangePasswordService', 'ElyModal',
    function ($state, ResetPassword, CheckChangePasswordService, ElyModal) {
        var ctrl = this;

        ctrl.running = false;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.close = function () {
            ElyModal.hide();
            $state.go('public');
        };

        ctrl.sendResetPassword = function () {
            ctrl.running = true;
            ResetPassword.save({linkId: ctrl.linkId, newPassword: ctrl.newPassword}, function () {
                ctrl.running = false;
                ctrl.success = true;
            }, function () {
                ctrl.running = false;
                ctrl.error = "Passwort konnte nicht geändert werden. Möglicherweise ist der Link ungültig.";

            });
        };

        ctrl.newPasswordChanged = function () {
            ctrl.uploadValid = CheckChangePasswordService.checkNewPasswordIsValid(ctrl.newPassword, ctrl.confirmNewPassword);

            ctrl.resetPasswordForm.newPassword.$setValidity('ely-min-length', true);
            ctrl.resetPasswordForm.newPassword.$setValidity('ely-char-missing', true);
            ctrl.resetPasswordForm.confirmNewPassword.$setValidity('ely-compare', true);
            if (!ctrl.uploadValid) {
                if (!CheckChangePasswordService.checkMinPasswordLength(ctrl.newPassword)) {
                    ctrl.resetPasswordForm.newPassword.$setValidity('ely-min-length', false);
                } else if (!CheckChangePasswordService.checkRequiredChar(ctrl.newPassword)) {
                    ctrl.resetPasswordForm.newPassword.$setValidity('ely-char-missing', false);
                } else if (!CheckChangePasswordService.checkNewPasswordEqual(ctrl.newPassword, ctrl.confirmNewPassword)) {
                    ctrl.resetPasswordForm.confirmNewPassword.$setValidity('ely-compare', false);
                }
            }
        };

        ctrl.confirmNewPasswordChanged = function () {
            ctrl.uploadValid = CheckChangePasswordService.checkNewPasswordIsValid(ctrl.newPassword, ctrl.confirmNewPassword);

            ctrl.resetPasswordForm.confirmNewPassword.$setValidity('ely-compare', true);
            if (!ctrl.uploadValid) {
                if (!CheckChangePasswordService.checkNewPasswordEqual(ctrl.newPassword, ctrl.confirmNewPassword)) {
                    ctrl.resetPasswordForm.confirmNewPassword.$setValidity('ely-compare', false);
                }
            }
        };
    }];
