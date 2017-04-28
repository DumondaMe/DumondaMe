'use strict';

module.exports = ['StepperDialogSteps', 'CreatePageSelectedPages', 'StepperDialogCommandHandler',
    function (StepperDialogSteps, CreatePageSelectedPages, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.step = {
            label: 'Auswählen',
            selected: false,
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.setSelectPage = function (selectedPage) {
            CreatePageSelectedPages.setSelectedPage(selectedPage);
            ctrl.selectedLabel = selectedPage;
            StepperDialogCommandHandler.enableNavigation();
        };
    }];
