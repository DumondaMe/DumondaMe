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
            StepperDialogCommandHandler.setFinishButtonAction(ctrl.finish);
        };

        /*ctrl.createBlog = function () {
            ElyModal.show('ManageBlogCtrl', 'app/modules/page/modal/manageBlog/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Blog', pageId: resp.pageId});
                });
        };

        ctrl.createBookPage = function () {
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Book', pageId: resp.pageId});
                });
        };

        ctrl.createYoutubePage = function () {
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Youtube', pageId: resp.pageId});
                });
        };

        ctrl.createLinkPage = function () {
            ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Link', pageId: resp.pageId});
                });
        };

        ctrl.createGenericPage = function () {
            ElyModal.show('ManageGenericPageCtrl', 'app/modules/page/modal/manageGenericPage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Generic', pageId: resp.pageId});
                });
        };*/
    }];

