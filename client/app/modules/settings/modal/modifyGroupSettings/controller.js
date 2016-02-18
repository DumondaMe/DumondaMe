'use strict';

module.exports = ['Privacy', '$mdDialog', 'errorToast', 'ModifyGroupNameService',
    function (Privacy, $mdDialog, errorToast, ModifyGroupNameService) {
        var ctrl = this;
        ctrl.uploadStarted = true;
        ctrl.uploadAllowed = false;

        ctrl.settings = Privacy.get({}, function () {
            ctrl.uploadStarted = false;
            ctrl.setting = ModifyGroupNameService.getSetting(ctrl.settings.normal, ctrl.settings.noContact, ctrl.groupName);
        });

        ctrl.cancel = function () {
            $mdDialog.cancel();
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
                $mdDialog.hide(ctrl.groupName);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

