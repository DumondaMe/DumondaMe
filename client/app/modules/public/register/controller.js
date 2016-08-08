'use strict';


module.exports = ['Register', 'errorToast', 'CountryCodeConverter', 'DateFormatCheckService', 'ProfileDataMessageService', '$state',
    'vcRecaptchaService', 'ElyModal', 'CheckChangePasswordService',
    function (Register, errorToast, CountryCodeConverter, DateFormatCheckService, ProfileDataMessageService, $state, vcRecaptchaService, ElyModal,
              CheckChangePasswordService) {
        var ctrl = this;

        ctrl.userToRegister = {};
        ctrl.userToRegister.female = "true";
        ctrl.agb = false;
        ctrl.showAgb = false;
        ctrl.countryCodes = CountryCodeConverter.countryCodes;
        ctrl.uploadValid = false;
        ctrl.getDateExample = DateFormatCheckService.getDateExample;
        ctrl.userToRegister.selectedCountryCode = ctrl.countryCodes[0];


        ctrl.change = function () {
            ctrl.registerUserForm.birthday.$setValidity('birthday-format', DateFormatCheckService.isDateValid(ctrl.userToRegister.birthday));
        };

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

        ctrl.upload = function () {
            var message = ProfileDataMessageService.getMessage(ctrl.userToRegister);
            message.email = ctrl.userToRegister.email;
            message.password = ctrl.userToRegister.password;
            ctrl.running = true;
            Register.save(message, function (resp) {
                $state.go('user.detail', {userId: resp.userId});
            }, function () {
                errorToast.showError('Das Registrieren des Benutzers ist fehlgeschlagen');
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

        ctrl.createAccount = function () {

        };

        ctrl.openAgb = function () {
            ctrl.showAgb = true;
            ctrl.agb = !ctrl.agb;
        };
    }];
