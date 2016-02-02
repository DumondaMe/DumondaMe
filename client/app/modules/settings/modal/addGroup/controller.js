'use strict';

module.exports = ['Privacy', '$mdDialog', 'CheckGroupNameService',
    function (Privacy, $mdDialog, CheckGroupNameService) {
        var ctrl = this;
        ctrl.profileVisible = true;
        ctrl.contactsVisible = true;
        ctrl.imageVisible = true;
        ctrl.profileDataVisible = true;
        ctrl.uploadAllowed = false;

        ctrl.nameChanged = function () {
            ctrl.validGroupName = CheckGroupNameService.checkNameExists(ctrl.groupName);
            ctrl.createGroupForm.groupName.$setValidity('ely-types-exist', ctrl.validGroupName);
        };

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Privacy.save({
                addNewPrivacy: {
                    privacySettings: {
                        profileVisible: ctrl.profileVisible,
                        contactsVisible: ctrl.contactsVisible,
                        imageVisible: ctrl.imageVisible,
                        profileDataVisible: ctrl.profileDataVisible
                    }, privacyDescription: ctrl.groupName
                }
            }, function () {
                $mdDialog.hide(ctrl.groupName);
            }, function () {
                ctrl.uploadStarted = false;
            });
        };

    }];

