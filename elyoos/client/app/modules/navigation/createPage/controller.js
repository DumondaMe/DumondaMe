'use strict';

module.exports = ['ElyModal', 'AddRemovePinwallElementService', '$mdBottomSheet',
    function (ElyModal, AddRemovePinwallElementService, $mdBottomSheet) {
        var ctrl = this;

        ctrl.createBlog = function () {
            $mdBottomSheet.hide();
            ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {element: ctrl.element})
                .then(function (resp) {
                    AddRemovePinwallElementService.addBlog(resp);
                });
        };

        ctrl.createBookPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html')
                .then(function (resp) {
                    AddRemovePinwallElementService.addRecommendation(resp);
                });
        };

        ctrl.createYoutubePage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html')
                .then(function (resp) {
                    AddRemovePinwallElementService.addRecommendation(resp);
                });
        };

        ctrl.createLinkPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html')
                .then(function (resp) {
                    AddRemovePinwallElementService.addRecommendation(resp);
                });
        };

        ctrl.createGenericPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageGenericPageCtrl', 'app/modules/page/modal/manageGenericPage/template.html')
                .then(function (resp) {
                    AddRemovePinwallElementService.addRecommendation(resp);
                });
        };
    }];

