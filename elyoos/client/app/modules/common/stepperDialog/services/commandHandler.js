'use strict';

module.exports = [function () {

    var service = this, stepperDialog, initStep;

    service.closeStepperDialog = function () {
        initStep = null;
    };

    service.setInitStep = function (newInitStep) {
        initStep = newInitStep;
    };

    service.setStepperDialog = function (newStepperDialog) {
        stepperDialog = newStepperDialog;
        initStep.initStepperFinish();
    };

    service.setFinishButtonAction = function(finishAction) {
        stepperDialog.setFinishButtonAction(finishAction);
    };

    service.disableFinishButton = function() {
        stepperDialog.disableFinishButton();
    };

    service.enableFinishButton = function() {
        stepperDialog.enableFinishButton();
    };

    service.enableNavigation = function () {
        stepperDialog.enableNavigation();
    };

    service.disableNavigation = function () {
        stepperDialog.disableNavigation();
    };

    service.showButtonOptionalFirst = function (label, command) {
        stepperDialog.showButtonOptionalFirst(label, command);
    };

    service.showButtonCommand = function (abort, command, label) {
        stepperDialog.showButtonCommand(abort, command, label);
    };

    service.hideButtonCommand = function () {
        stepperDialog.hideButtonCommand();
    };

    service.enableButtonCommand = function () {
        stepperDialog.enableButtonCommand();
    };

    service.disableButtonCommand = function () {
        stepperDialog.disableButtonCommand();
    };

    service.hideButtonAbortCommand = function () {
        stepperDialog.hideButtonAbortCommand();
    };

    service.showProgressBar = function () {
        stepperDialog.showProgressBar();
    };

    service.hideProgressBar = function () {
        stepperDialog.hideProgressBar();
    };

    service.showButtonFinishInfo = function () {
        stepperDialog.showButtonFinishInfo();
    };
}];
