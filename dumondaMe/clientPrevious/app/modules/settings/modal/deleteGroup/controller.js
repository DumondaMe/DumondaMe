'use strict';

module.exports = ['Privacy', 'ElyModal', 'ContactGroupStatistic', 'errorToast',
    function (Privacy, ElyModal, ContactGroupStatistic, errorToast) {
        var ctrl = this;

        ctrl.groups = ContactGroupStatistic.getGroups(ctrl.groupName);
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

