'use strict';

module.exports = ['ElyModal', 'FinishSetupAccount', 'errorToast', 'StepperDialogCommandHandler',
    function (ElyModal, FinishSetupAccount, errorToast, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.close = function () {
            ElyModal.cancel();
        };

        ctrl.finish = function () {
            FinishSetupAccount.save({}, function () {
                ElyModal.hide();
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
            });
        };
        StepperDialogCommandHandler.setInitStep(ctrl);
        ctrl.initStepperFinish = function () {
            StepperDialogCommandHandler.showButtonOptionalFirst('Später', ctrl.close);
            StepperDialogCommandHandler.setFinishButtonAction(ctrl.finish);
        };
    }];
