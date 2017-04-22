'use strict';

module.exports = ['StepperDialogSteps', 'InviteFriendsUserMessage',
    function (StepperDialogSteps, InviteFriendsUserMessage) {
        var ctrl = this;

        ctrl.step = {
            label: 'Mitteilung',
            selected: false,
            isSelectedNotification: function () {
                ctrl.message = InviteFriendsUserMessage.getMessage();
            }
        };
        StepperDialogSteps.addStep(ctrl.step);
        ctrl.message = InviteFriendsUserMessage.getMessage();

        ctrl.messageChanged = function () {
            if (ctrl.messageForm.$error.hasOwnProperty('md-maxlength')) {
                ctrl.invalidMessage = true;
            } else {
                ctrl.invalidMessage = false;
                InviteFriendsUserMessage.setMessage(ctrl.message);
            }
        };
    }];
