'use strict';

module.exports = ['Profile', 'ElyModal', 'errorToast', 'CountryCodeConverter', 'DateFormatCheckService', 'ProfileDataMessageService', 'userInfo',
    function (Profile, ElyModal, errorToast, CountryCodeConverter, DateFormatCheckService, ProfileDataMessageService, userInfo) {
        var ctrl = this;

        ctrl.countryCodes = CountryCodeConverter.countryCodes;
        ctrl.uploadValid = false;
        ctrl.getDateExample = DateFormatCheckService.getDateExample;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.userDataToChange = Profile.get({}, function () {
            ProfileDataMessageService.convertReceivedMessage(ctrl.userDataToChange);
            ctrl.userDataOnServer = angular.copy(ctrl.userDataToChange);
        });

        ctrl.change = function () {
            ctrl.uploadValid = !angular.equals(ctrl.userDataOnServer, ctrl.userDataToChange);
        };

        ctrl.upload = function () {
            var message = ProfileDataMessageService.getMessage(ctrl.userDataToChange);
            ctrl.running = true;
            Profile.save(message, function () {
                userInfo.profileDataChangedEvent();
                ElyModal.hide();
            }, function () {
                errorToast.showError('Das Hochladen der Profildaten ist fehlgeschlagen');
                ctrl.uploadValid = false;
                ctrl.running = false;
            });
        };

    }];

