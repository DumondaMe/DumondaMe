'use strict';

module.exports = ['StepperDialogSteps', 'StepperDialogCommandHandler',
    function (StepperDialogSteps, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.step = {
            label: 'Privatsphäre',
            selected: false
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.uploadStarted = function (isStarted) {
            if (isStarted) {
                StepperDialogCommandHandler.showProgressBar();
            } else {
                StepperDialogCommandHandler.hideProgressBar();
            }
        };
    }];
