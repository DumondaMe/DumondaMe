'use strict';

module.exports = ['StepperDialogCommandHandler', 'GenericPageCreateMessageService', 'UploadPageService',
    'errorToast', 'ElyModal', '$state',
    function (StepperDialogCommandHandler, GenericPageCreateMessageService, UploadPageService,
              errorToast, ElyModal, $state) {
        var ctrl = this;

        ctrl.data = {};
        StepperDialogCommandHandler.disableFinishButton();

        ctrl.showImage = function () {
            ctrl.selectImage = true;
            StepperDialogCommandHandler.showButtonCommand(ctrl.abortSelectImage, ctrl.startAddSelectedImage, "Auswählen");
        };

        ctrl.startAddSelectedImage = function () {
            StepperDialogCommandHandler.showProgressBar();
            ctrl.loadImage();
        };

        ctrl.setPreviewImage = function (blob, dataUri) {
            ctrl.selectImage = false;
            ctrl.data.dataUri = dataUri;
            ctrl.blob = blob;
            StepperDialogCommandHandler.hideButtonCommand();
            StepperDialogCommandHandler.hideProgressBar();
        };

        ctrl.abortSelectImage = function () {
            StepperDialogCommandHandler.hideProgressBar();
            ctrl.selectImage = false;
        };

        ctrl.eventHasImage = function () {
            StepperDialogCommandHandler.enableButtonCommand();
        };

        ctrl.dataChanged = function (changed, isValid) {
            if (isValid) {
                StepperDialogCommandHandler.enableFinishButton();
            } else {
                StepperDialogCommandHandler.disableFinishButton();
            }
        };

        ctrl.loadingImageIsRunning = function (isRunning) {
            if (isRunning) {
                StepperDialogCommandHandler.showProgressBar();
            } else {
                StepperDialogCommandHandler.hideProgressBar();
            }
        };

        ctrl.createGeneric = function () {
            var message = GenericPageCreateMessageService.getCreateGenericPageMessage(ctrl.data);
            StepperDialogCommandHandler.showProgressBar();
            UploadPageService.uploadCreatePage(message, ctrl).then(function (resp) {
                StepperDialogCommandHandler.hideProgressBar();
                ElyModal.hide();
                $state.go('page.detail', {label: 'Generic', pageId: resp.pageId});
            });
        };

        StepperDialogCommandHandler.setFinishButtonAction(ctrl.createGeneric);
    }];
