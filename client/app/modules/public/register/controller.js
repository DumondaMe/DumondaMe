'use strict';


module.exports = ['Register', 'errorToast', 'CountryCodeConverter', 'DateFormatCheckService', 'ProfileDataMessageService', '$state',
    'vcRecaptchaService', 'ElyModal',
    function (Register, errorToast, CountryCodeConverter, DateFormatCheckService, ProfileDataMessageService, $state, vcRecaptchaService, ElyModal) {
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
