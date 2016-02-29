'use strict';

module.exports = ['Privacy', 'ElyModal', 'errorToast', 'ModifyGroupNameService',
    function (Privacy, ElyModal, errorToast, ModifyGroupNameService) {
        var ctrl = this;
        ctrl.uploadStarted = true;
        ctrl.uploadAllowed = false;

        ctrl.settings = Privacy.get({}, function () {
            ctrl.uploadStarted = false;
            ctrl.setting = ModifyGroupNameService.getSetting(ctrl.settings.normal, ctrl.settings.noContact, ctrl.groupName);
        });

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.selectChanged = function () {
            ctrl.uploadAllowed = ModifyGroupNameService.settingHasChanged(ctrl.setting);
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save({
                changePrivacySetting: {
                    privacySettings: {
                        profileVisible: ctrl.setting.profileVisible,
                        contactsVisible: ctrl.setting.contactsVisible,
                        imageVisible: ctrl.setting.imageVisible,
                        profileDataVisible: ctrl.setting.profileDataVisible
                    }, privacyDescription: ctrl.groupName
                }
            }, function () {
                ElyModal.hide(ctrl.groupName);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

