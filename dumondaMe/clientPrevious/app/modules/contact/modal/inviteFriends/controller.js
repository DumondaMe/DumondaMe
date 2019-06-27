'use strict';

module.exports = ['ElyModal', 'StepperDialogCommandHandler',
    function (ElyModal, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.data = {message: null, selectedAddresses: []};

        ctrl.close = function () {
            ElyModal.cancel();
        };

        StepperDialogCommandHandler.setInitStep(ctrl);
        ctrl.initStepperFinish = function () {
            StepperDialogCommandHandler.disableNavigation();
            StepperDialogCommandHandler.showButtonOptionalFirst('Abbrechen', ctrl.close);
        };
    }];
