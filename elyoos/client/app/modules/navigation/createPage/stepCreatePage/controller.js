'use strict';

module.exports = ['StepperDialogSteps', 'CreatePageSelectedPages', 'StepperDialogCommandHandler',
    function (StepperDialogSteps, CreatePageSelectedPages, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.step = {
            label: 'Erstellen',
            selected: false,
        };
        StepperDialogSteps.addStep(ctrl.step);
        ctrl.selectedPage = CreatePageSelectedPages.getSelectedPage();
    }];
