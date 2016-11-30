'use strict';

module.exports = ['Privacy', 'ElyModal', 'errorToast', 'ModifyGroupNameService', 'ModifyGroupMessageService', 'ProfileVisibleHandlerService',
    function (Privacy, ElyModal, errorToast, ModifyGroupNameService, ModifyGroupMessageService, ProfileVisibleHandlerService) {
        var ctrl = this;
        ctrl.uploadStarted = false;
        ctrl.uploadAllowed = false;
        ctrl.isDirective = false;

        ModifyGroupNameService.setLastSetting(ctrl.setting);

        ctrl.cancel = function () {
            ctrl.abort();
        };

        ctrl.selectProfileVisibleChanged = function () {
            ProfileVisibleHandlerService.setProfileVisibleChanged(ctrl.setting);
            ctrl.uploadAllowed = ModifyGroupNameService.settingHasChanged(ctrl.setting);
        };

        ctrl.selectChanged = function () {
            ProfileVisibleHandlerService.setProfileChanged(ctrl.setting);
            ctrl.uploadAllowed = ModifyGroupNameService.settingHasChanged(ctrl.setting);
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save(ModifyGroupMessageService.getMessage(ctrl.setting),
                function () {
                    ctrl.finish();
                }, function () {
                    errorToast.showError('Es ist ein Fehler aufgetretten!');
                    ctrl.uploadStarted = false;
                });
        };

    }];

