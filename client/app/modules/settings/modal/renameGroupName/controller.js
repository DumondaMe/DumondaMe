'use strict';

module.exports = ['Privacy', 'ElyModal', 'CheckGroupNameService', 'errorToast',
    function (Privacy, ElyModal, CheckGroupNameService, errorToast) {
        var ctrl = this;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };
        
        ctrl.nameChanged = function () {
            ctrl.renameGroupNameForm.newGroupName.$setValidity('ely-types-exist', CheckGroupNameService.checkNameExists(ctrl.newGroupName));
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

