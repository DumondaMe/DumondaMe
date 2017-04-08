'use strict';

module.exports = ['Privacy', 'ElyModal', 'CheckGroupNameService', 'errorToast',
    function (Privacy, ElyModal, CheckGroupNameService, errorToast) {
        var ctrl = this;

        ctrl.newGroupName = angular.copy(ctrl.groupName);

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.nameChanged = function () {
            ctrl.renameGroupNameForm.newGroupName.$setValidity('ely-types-exist', true);
            ctrl.uploadAllowed = true;
            if (ctrl.newGroupName === ctrl.groupName) {
                ctrl.uploadAllowed = false;
            } else if (!CheckGroupNameService.checkNameExists(ctrl.newGroupName)) {
                ctrl.uploadAllowed = false;
                ctrl.renameGroupNameForm.newGroupName.$setValidity('ely-types-exist', false);
            }
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save({
                renamePrivacy: {
                    privacyDescription: ctrl.groupName,
                    newPrivacyDescription: ctrl.newGroupName
                }
            }, function () {
                ElyModal.hide(ctrl.newGroupName);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

