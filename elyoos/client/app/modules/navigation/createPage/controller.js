'use strict';

module.exports = ['ElyModal', 'PinwallBlogService', '$mdBottomSheet',
    function (ElyModal, PinwallBlogService, $mdBottomSheet) {
        var ctrl = this;

        ctrl.createBlog = function () {
            $mdBottomSheet.hide();
            ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {element: ctrl.element})
                .then(function (resp) {
                    PinwallBlogService.addBlog(resp);
                });
        };

        ctrl.createBookPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html')
                .then(function (resp) {
                    PinwallBlogService.addRecommendation(resp);
                });
        };

        ctrl.createYoutubePage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html')
                .then(function (resp) {
                    PinwallBlogService.addRecommendation(resp);
                });
        };

        ctrl.createLinkPage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html')
                .then(function (resp) {
                    PinwallBlogService.addRecommendation(resp);
                });
        };

        ctrl.createPlacePage = function () {
            $mdBottomSheet.hide();
            ElyModal.show('ManagePlacePageCtrl', 'app/modules/page/modal/managePlacePage/template.html')
                .then(function (resp) {
                    PinwallBlogService.addRecommendation(resp);
                });
        };
    }];

