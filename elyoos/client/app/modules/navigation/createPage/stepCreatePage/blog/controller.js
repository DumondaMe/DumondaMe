'use strict';

module.exports = ['StepperDialogCommandHandler', 'UploadBlog', 'Topics', 'errorToast', 'ElyModal', '$state',
    function (StepperDialogCommandHandler, UploadBlog, Topics, errorToast, ElyModal, $state) {
        var ctrl = this;

        ctrl.data = {};
        ctrl.showPrivacy = false;
        StepperDialogCommandHandler.disableFinishButton();

        ctrl.closePrivacy = function () {
            ctrl.showPrivacy = false;
            StepperDialogCommandHandler.hideButtonCommand();
            ctrl.setVisibility();
        };

        ctrl.showPrivacyEvent = function () {
            ctrl.showPrivacy = true;
            StepperDialogCommandHandler.showButtonCommand(ctrl.closePrivacy, ctrl.closePrivacy, "Fertig");
            StepperDialogCommandHandler.hideButtonAbortCommand();
            StepperDialogCommandHandler.enableButtonCommand();
        };

        ctrl.visibilityChanged = function (isValid) {
            if (isValid) {
                StepperDialogCommandHandler.enableButtonCommand();
            } else {
                StepperDialogCommandHandler.disableButtonCommand();
            }
        };

        ctrl.dataChanged = function (changed, isValid) {
            if(isValid) {
                StepperDialogCommandHandler.enableFinishButton();
            } else {
                StepperDialogCommandHandler.disableFinishButton();
            }
        };

        ctrl.createBlog = function () {
            StepperDialogCommandHandler.showProgressBar();
            UploadBlog.upload(ctrl.data.blogText, ctrl.data.blogTitle,
                Topics.getCodes(ctrl.data.selectedTopics), ctrl.data.selectedLanguage,
                ctrl.data.imageForUploadPreviewData)
                .then(function (resp) {
                    StepperDialogCommandHandler.hideProgressBar();
                    ElyModal.hide();
                    $state.go('page.detail', {label: 'Blog', pageId: resp.pageId});
                }).catch(function () {
                StepperDialogCommandHandler.hideProgressBar();
                errorToast.showError('Blog konnte nicht erstellt werden');
            });
        };

        StepperDialogCommandHandler.setFinishButtonAction(ctrl.createBlog);
    }];
