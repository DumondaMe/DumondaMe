'use strict';

module.exports = ['StepperDialogSteps', 'CreatePageSelectedPages',
    function (StepperDialogSteps, CreatePageSelectedPages) {
        var ctrl = this;

        ctrl.step = {
            label: 'Auswählen',
            selected: false,
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.setSelectPage = function (selectedPage) {
            CreatePageSelectedPages.setSelectedPage(selectedPage);
            ctrl.selectedLabel = selectedPage;
        };
        ctrl.setSelectPage('Generic');
    }];
