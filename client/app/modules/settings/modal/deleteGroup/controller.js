'use strict';

module.exports = ['Privacy', 'ElyModal', 'ContactStatisticTypes', 'errorToast',
    function (Privacy, ElyModal, ContactStatisticTypes, errorToast) {
        var ctrl = this;

        ctrl.groups = ContactStatisticTypes.getTypes(ctrl.groupName);
        ctrl.selectedGroup = ctrl.groups[0];

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.delete({
                privacyDescription: ctrl.groupName,
                newPrivacyDescription: ctrl.selectedGroup
            }, function () {
                ElyModal.hide(ctrl.selectedGroup);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

