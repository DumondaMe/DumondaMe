'use strict';

module.exports = ['SendInviteEmail', 'ElyModal', 'InviteFriendsSelectedEMails', 'StepperDialogSteps',
    'InviteFriendsUserMessage', 'StepperDialogCommandHandler', 'errorToast',
    function (SendInviteEmail, ElyModal, InviteFriendsSelectedEMails, StepperDialogSteps,
              InviteFriendsUserMessage, StepperDialogCommandHandler, errorToast) {
        var ctrl = this;

        ctrl.step = {
            label: 'Versenden',
            selected: false,
            isSelectedNotification: function () {
                ctrl.selectedAddresses = InviteFriendsSelectedEMails.getSelectedEmails();
            }
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.close = function () {
            ElyModal.hide();
        };

        ctrl.upload = function () {
            var message = {}, userMessage = InviteFriendsUserMessage.getMessage();
            StepperDialogCommandHandler.showProgressBar();
            message.emails = InviteFriendsSelectedEMails.getEmails();
            if (angular.isString(userMessage) && userMessage.trim() !== "") {
                message.message = userMessage;
            }
            SendInviteEmail.save(message,
                function () {
                    ctrl.successfullySent = true;
                    StepperDialogCommandHandler.hideProgressBar();
                    StepperDialogCommandHandler.showButtonFinishInfo();
                }, function () {
                    StepperDialogCommandHandler.hideProgressBar();
                    errorToast.error("Fehler beim versenden");
                });
        };

        StepperDialogCommandHandler.setFinishButtonAction(ctrl.upload);
    }];
