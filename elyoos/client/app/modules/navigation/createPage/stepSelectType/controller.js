'use strict';

module.exports = ['StepperDialogSteps', 'CreatePageSelectedPages', 'StepperDialogCommandHandler',
    'RecommendationTypes',
    function (StepperDialogSteps, CreatePageSelectedPages, StepperDialogCommandHandler,
              RecommendationTypes) {
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
            StepperDialogSteps.setStepLabel('createStep',
                RecommendationTypes.getRecommendationType(selectedPage) + ' erstellen');
        };
    }];
