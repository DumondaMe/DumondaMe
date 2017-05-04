'use strict';

module.exports = ['ElyModal', 'StepperDialogCommandHandler',
    function (ElyModal, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        StepperDialogCommandHandler.setInitStep(ctrl);
        ctrl.initStepperFinish = function () {
            StepperDialogCommandHandler.disableNavigation();
            StepperDialogCommandHandler.showButtonOptionalFirst('Abbrechen', ctrl.cancel);
        };
    }];

