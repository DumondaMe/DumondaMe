'use strict';

module.exports = ['Privacy', '$mdDialog', 'ContactStatisticTypes', 'errorToast',
    function (Privacy, $mdDialog, ContactStatisticTypes, errorToast) {
        var ctrl = this;

        ctrl.groups = ContactStatisticTypes.getTypes(ctrl.groupName);
        ctrl.selectedGroup = ctrl.groups[0];

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.delete({
                privacyDescription: ctrl.groupName,
                newPrivacyDescription: ctrl.selectedGroup
            }, function () {
                $mdDialog.hide(ctrl.selectedGroup);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

