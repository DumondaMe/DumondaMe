'use strict';

module.exports = ['ElyModal', 'Privacy', 'PrivacySettingService', function (ElyModal, Privacy, PrivacySettingService) {
    var ctrl = this;

    ctrl.cancel = function () {
        ElyModal.cancel();
    };

    ctrl.settings = Privacy.get({}, function () {
        ctrl.uploadStarted = false;
        ctrl.groupNames = PrivacySettingService.getGroupNames(ctrl.settings.group);
        ctrl.groupNamesProfileVisible = angular.copy(ctrl.groupNames);
    });

    ctrl.profileVisibleChanged = function (selected) {
        ctrl.settings = PrivacySettingService.setPrivacySettingProfileVisible(ctrl.settings, selected);
        PrivacySettingService.setDisabled(ctrl.settings, ctrl.groupNames);
    };
}];
