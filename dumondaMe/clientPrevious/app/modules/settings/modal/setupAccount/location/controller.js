'use strict';

module.exports = ['StepperDialogSteps', 'StepperDialogCommandHandler',
    function (StepperDialogSteps, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.step = {
            label: 'Standort',
            selected: false
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.requestStarted = function (newRequestStarted) {
            if(newRequestStarted) {
                StepperDialogCommandHandler.showProgressBar();
            } else {
                StepperDialogCommandHandler.hideProgressBar();
            }
        };

        ctrl.disableNavigation = function (newDisabledNavigation) {
            if(newDisabledNavigation) {
                StepperDialogCommandHandler.disableNavigation();
            } else {
                StepperDialogCommandHandler.enableNavigation();
            }
        };
    }];
