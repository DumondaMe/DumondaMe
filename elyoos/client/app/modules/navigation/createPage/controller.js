'use strict';

module.exports = ['ElyModal', 'AddRemovePinwallElementService', '$mdBottomSheet', '$state',
    function (ElyModal, AddRemovePinwallElementService, $mdBottomSheet, $state) {
        var ctrl = this;

        ctrl.createBlog = function () {
            $mdBottomSheet.hide();
            ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {element: ctrl.element})
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Blog', pageId: resp.pageId});
                });
        };

        ctrl.createBookPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Book', pageId: resp.pageId});
                });
        };

        ctrl.createYoutubePage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Youtube', pageId: resp.pageId});
                });
        };

        ctrl.createLinkPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Link', pageId: resp.pageId});
                });
        };

        ctrl.createGenericPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageGenericPageCtrl', 'app/modules/page/modal/manageGenericPage/template.html')
                .then(function (resp) {
                    $state.go('page.detail', {label: 'Generic', pageId: resp.pageId});
                });
        };
    }];

