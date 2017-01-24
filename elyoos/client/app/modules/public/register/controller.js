'use strict';


module.exports = ['Register', 'errorToast', '$state', 'vcRecaptchaService', 'ElyModal', 'CheckChangePasswordService',
    function (Register, errorToast, $state, vcRecaptchaService, ElyModal, CheckChangePasswordService) {
        var ctrl = this;

        ctrl.userToRegister = {};
        ctrl.agb = false;
        ctrl.showAgb = false;
        ctrl.successfulRegisterRequest = false;
        ctrl.uploadValid = false;

        ctrl.newPasswordChanged = function () {
            var uploadValid = CheckChangePasswordService.checkNewPasswordIsValid(ctrl.userToRegister.password, ctrl.confirmNewPassword);

            ctrl.registerUserForm.password.$setValidity('ely-min-length', true);
            ctrl.registerUserForm.password.$setValidity('ely-char-missing', true);
            ctrl.registerUserForm.confirmNewPassword.$setValidity('ely-compare', true);
            if (!uploadValid) {
                if (!CheckChangePasswordService.checkMinPasswordLength(ctrl.userToRegister.password)) {
                    ctrl.registerUserForm.password.$setValidity('ely-min-length', false);
                } else if (!CheckChangePasswordService.checkRequiredChar(ctrl.userToRegister.password)) {
                    ctrl.registerUserForm.password.$setValidity('ely-char-missing', false);
                } else if (!CheckChangePasswordService.checkNewPasswordEqual(ctrl.userToRegister.password, ctrl.confirmNewPassword)) {
                    ctrl.registerUserForm.confirmNewPassword.$setValidity('ely-compare', false);
                }
            }
        };

        ctrl.confirmNewPasswordChanged = function () {
            var uploadValid = CheckChangePasswordService.checkNewPasswordIsValid(ctrl.userToRegister.password, ctrl.confirmNewPassword);

            ctrl.registerUserForm.confirmNewPassword.$setValidity('ely-compare', true);
            if (!uploadValid) {
                if (!CheckChangePasswordService.checkNewPasswordEqual(ctrl.userToRegister.password, ctrl.confirmNewPassword)) {
                    ctrl.registerUserForm.confirmNewPassword.$setValidity('ely-compare', false);
                }
            }
        };

        ctrl.createAccount = function () {
            var message = {};
            message.forename = ctrl.userToRegister.forename;
            message.surname = ctrl.userToRegister.surname;
            message.email = ctrl.userToRegister.email;
            message.password = ctrl.userToRegister.password;
            message.response = ctrl.response;
            ctrl.running = true;
            Register.save(message, function () {
                ctrl.running = false;
                ctrl.successfulRegisterRequest = true;
            }, function (err) {
                if (err.data && err.data.errorCode === 2) {
                    errorToast.showError('Für diese Email Adresse existiert bereits ein Konto');
                } else if ((err.data && err.data.errorCode === 1)) {
                    errorToast.showError('Validierung ob eine Person das Konto erstellen möchte ist fehlgeschlagen');
                } else {
                    errorToast.showError('Das Registrieren ist fehlgeschlagen');
                }
                ctrl.running = false;
            });
        };

        ctrl.setResponse = function (response) {
            ctrl.response = response;
        };
        ctrl.setWidgetId = function (widgetId) {
            ctrl.widgetId = widgetId;
        };
        ctrl.cbExpiration = function () {
            vcRecaptchaService.reload(ctrl.widgetId);
            ctrl.response = null;
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.openAgb = function () {
            ctrl.showAgb = true;
            ctrl.agb = !ctrl.agb;
        };
    }];
