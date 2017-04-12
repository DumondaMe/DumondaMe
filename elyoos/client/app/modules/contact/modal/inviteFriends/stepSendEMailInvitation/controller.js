'use strict';

module.exports = ['SendInviteEmail', 'ElyModal', 'InviteFriendsSelectedEMails',
    function (SendInviteEmail, ElyModal, InviteFriendsSelectedEMails) {
        var ctrl = this;

        ctrl.close = function () {
            ElyModal.hide();
        };

        ctrl.finish = function () {
            ctrl.upload();
        };

        ctrl.upload = function () {
            var message = {};
            ctrl.uploadStarted = true;
            message.emails = InviteFriendsSelectedEMails.getEmails(ctrl.data.selectedAddresses);
            if (angular.isString(ctrl.data.message) && ctrl.data.message.trim() !== "") {
                message.message = ctrl.data.message;
            }
            SendInviteEmail.save(message,
                function () {
                    ctrl.successfullySent = true;
                    ctrl.finishInfo = true;
                    ctrl.uploadStarted = false;
                }, function () {
                    ctrl.uploadStarted = false;
                });
        };
    }];
