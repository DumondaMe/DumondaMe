'use strict';

module.exports = ['ElyModal', 'PinwallBlogService', function (ElyModal, PinwallBlogService) {
    var ctrl = this;

    ctrl.createBookPage = function () {
        ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html')
            .then(function (resp) {
                PinwallBlogService.addRecommendation(resp);
            });
    };

    ctrl.createYoutubePage = function () {
        ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html')
            .then(function (resp) {
                PinwallBlogService.addRecommendation(resp);
            });
    };

    ctrl.createLinkPage = function () {
        ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html')
            .then(function (resp) {
                PinwallBlogService.addRecommendation(resp);
            });
    };
}];

