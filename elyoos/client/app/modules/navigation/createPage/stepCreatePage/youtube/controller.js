'use strict';

module.exports = ['StepperDialogCommandHandler', 'YoutubePageCreateMessageService', 'UploadPageService',
    'errorToast', 'ElyModal', '$state',
    function (StepperDialogCommandHandler, YoutubePageCreateMessageService, UploadPageService,
              errorToast, ElyModal, $state) {
        var ctrl = this;

        ctrl.data = {};
        StepperDialogCommandHandler.disableFinishButton();

        ctrl.dataChanged = function (changed, isValid) {
            if (isValid) {
                StepperDialogCommandHandler.enableFinishButton();
            } else {
                StepperDialogCommandHandler.disableFinishButton();
            }
        };

        ctrl.showExistingVideos = function (searchResult) {
            ctrl.showExistingPages = true;
            ctrl.searchResult = searchResult;
            StepperDialogCommandHandler.showButtonCommand(ctrl.closeShowExistingPages,
                ctrl.closeShowExistingPages, "Zurück");
            StepperDialogCommandHandler.hideButtonAbortCommand();
            StepperDialogCommandHandler.enableButtonCommand();
        };

        ctrl.closeShowExistingPages = function () {
            ctrl.showExistingPages = false;
            StepperDialogCommandHandler.hideButtonCommand();
        };

        ctrl.createVideo = function () {
            var message = YoutubePageCreateMessageService.getCreateYoutubePageMessage(ctrl.data);
            StepperDialogCommandHandler.showProgressBar();
            UploadPageService.uploadCreatePage(message, ctrl).then(function (resp) {
                StepperDialogCommandHandler.hideProgressBar();
                ElyModal.hide();
                $state.go('page.detail', {label: 'Youtube', pageId: resp.pageId});
            });
        };

        StepperDialogCommandHandler.setFinishButtonAction(ctrl.createVideo);
    }];
