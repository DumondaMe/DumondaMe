'use strict';

module.exports = ['Privacy', 'ElyModal', 'CheckGroupNameService', 'errorToast',
    function (Privacy, ElyModal, CheckGroupNameService, errorToast) {
        var ctrl = this;
        ctrl.contactsVisible = true;
        ctrl.imageVisible = true;
        ctrl.pinwallVisible = true;
        ctrl.uploadAllowed = false;

        ctrl.nameChanged = function (newName) {
            ctrl.groupName = newName;
            ctrl.validGroupName = CheckGroupNameService.checkNameExists(ctrl.groupName);
            ctrl.createGroupForm.groupName.$setValidity('ely-types-exist', ctrl.validGroupName);

            if (angular.isFunction(ctrl.groupNameCheckEvent)) {
                ctrl.groupNameCheckEvent(!ctrl.validGroupName || ctrl.createGroupForm.$error.hasOwnProperty('required') ||
                    ctrl.createGroupForm.$error.hasOwnProperty('md-maxlength') ||
                    (angular.isString(ctrl.groupName) && ctrl.groupName.trim() === ""));
            }
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.addGroup = function () {
            ctrl.accept();
        };

        ctrl.accept = function () {
            var groupName = ctrl.groupName.trim();
            ctrl.uploadStarted = true;
            Privacy.save({
                addNewPrivacy: {
                    privacySettings: {
                        type: groupName,
                        contactsVisible: ctrl.contactsVisible,
                        imageVisible: ctrl.imageVisible,
                        pinwallVisible: ctrl.pinwallVisible
                    }
                }
            }, function () {
                ctrl.uploadStarted = false;
                if (angular.isFunction(ctrl.finishEvent)) {
                    ctrl.finishEvent(groupName);
                } else {
                    ElyModal.hide(groupName);
                }
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

