'use strict';

module.exports = ['StepperDialogSteps', 'CreatePageSelectedPages',
    function (StepperDialogSteps, CreatePageSelectedPages) {
        var ctrl = this;

        ctrl.step = {
            label: 'Erstellen',
            selected: false,
            isSelectedNotification: function () {
                ctrl.selectedPage = CreatePageSelectedPages.getSelectedPage();
            }
        };
        StepperDialogSteps.addStep(ctrl.step);
    }];
