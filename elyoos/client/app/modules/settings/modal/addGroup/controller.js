'use strict';

module.exports = ['Privacy', 'ElyModal', 'CheckGroupNameService', 'errorToast',
    function (Privacy, ElyModal, CheckGroupNameService, errorToast) {
        var ctrl = this;
        ctrl.contactsVisible = true;
        ctrl.imageVisible = true;
        ctrl.pinwallVisible = true;
        ctrl.uploadAllowed = false;

        ctrl.nameChanged = function () {
            ctrl.validGroupName = CheckGroupNameService.checkNameExists(ctrl.groupName);
            ctrl.createGroupForm.groupName.$setValidity('ely-types-exist', ctrl.validGroupName);
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save({
                addNewPrivacy: {
                    privacySettings: {
                        type: ctrl.groupName,
                        contactsVisible: ctrl.contactsVisible,
                        imageVisible: ctrl.imageVisible,
                        pinwallVisible: ctrl.pinwallVisible
                    }
                }
            }, function () {
                ElyModal.hide(ctrl.groupName);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

