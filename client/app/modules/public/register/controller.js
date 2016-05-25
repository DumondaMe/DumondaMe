'use strict';


module.exports = ['Register', 'errorToast', 'CountryCodeConverter', 'DateFormatCheckService', 'ProfileDataMessageService', '$state',
    function (Register, errorToast, CountryCodeConverter, DateFormatCheckService, ProfileDataMessageService, $state) {
        var ctrl = this;

        ctrl.userToRegister = {};
        ctrl.userToRegister.female = "true";
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

    }];