'use strict';


module.exports = ['$scope', '$mdMedia', 'ElyModal', 'StepperDialogScrollRequest', 'StepperDialogSteps',
    'StepperDialogCommandHandler',
    function ($scope, $mdMedia, ElyModal, StepperDialogScrollRequest, StepperDialogSteps, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;
        ctrl.selectedStep = 0;
        ctrl.showNavigation = true;

        ctrl.closeModal = function () {
            ElyModal.hide();
        };

        ctrl.back = function () {
            if (ctrl.selectedStep > 0) {
                ctrl.selectedStep = StepperDialogSteps.selectStep(ctrl.selectedStep - 1, true);
            }
        };

        ctrl.next = function () {
            if (ctrl.selectedStep < ctrl.steps.length - 1) {
                ctrl.selectedStep = StepperDialogSteps.selectStep(ctrl.selectedStep + 1, true);
            }
        };

        ctrl.nextScrollRequest = function () {
            StepperDialogScrollRequest.nextScrollRequest();
        };

        $scope.$on('$destroy', function () {
            StepperDialogScrollRequest.closeStepperDialog();
            StepperDialogSteps.closeStepperDialog();
            StepperDialogCommandHandler.closeStepperDialog();
        });

        //StepperDialogSteps functions
        ctrl.notifyStepAdded = function (newSteps) {
            ctrl.steps = newSteps;
        };

        //StepperDialogCommandHandler functions ------------
        ctrl.showButtonOptionalFirst = function (label, command) {
            ctrl.optionalFirstLabel = label;
            ctrl.optionalFirstCommand = command;
            ctrl.showOptionalFirst = true;
        };

        ctrl.showButtonCommand = function (abort, command, label) {
            ctrl.showCommand = true;
            ctrl.commandIsDisabled = true;
            ctrl.showNavigation = false;
            ctrl.abortCommand = abort;
            ctrl.command = command;
            ctrl.commandLabel = label;
        };

        ctrl.hideButtonCommand = function () {
            ctrl.showCommand = false;
            ctrl.showNavigation = true;
        };

        ctrl.disableButtonCommand = function () {
            ctrl.commandIsDisabled = true;
        };

        ctrl.enableButtonCommand = function () {
            ctrl.commandIsDisabled = false;
        };

        ctrl.showProgressBar = function () {
            ctrl.showProgress = true;
        };

        ctrl.hideProgressBar = function () {
            ctrl.showProgress = false;
        };

        ctrl.enableNavigation = function () {
            ctrl.commandIsDisabled = true;
            ctrl.navigationDisabled = false;
        };

        ctrl.disableNavigation = function () {
            ctrl.navigationDisabled = true;
        };

        ctrl.setFinishButtonAction = function (finishAction) {
            ctrl.finish = finishAction;
        };

        //--------------------------------------------------------------------

        StepperDialogSteps.setStepperDialog(ctrl);
        StepperDialogCommandHandler.setStepperDialog(ctrl);
    }];
