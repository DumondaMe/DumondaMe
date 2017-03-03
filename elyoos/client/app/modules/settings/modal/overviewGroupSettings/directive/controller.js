'use strict';

module.exports = ['ElyModal', 'Privacy', 'PrivacySettingService', function (ElyModal, Privacy, PrivacySettingService) {
    var ctrl = this;

    ctrl.cancel = function () {
        ElyModal.cancel();
    };

    ctrl.settings = Privacy.get({}, function () {
        ctrl.uploadStarted = false;
        ctrl.groupNames = PrivacySettingService.getGroupNames(ctrl.settings.normal);
    });
}];
