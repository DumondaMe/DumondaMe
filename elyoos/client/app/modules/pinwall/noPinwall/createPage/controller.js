'use strict';

module.exports = ['ElyModal', 'AddRemovePinwallElementService', function (ElyModal, AddRemovePinwallElementService) {
    var ctrl = this;

    ctrl.createBookPage = function () {
        ElyModal.show('ManageBookPageCtrl', 'app/modules/page/modal/manageBookPage/template.html')
            .then(function (resp) {
                AddRemovePinwallElementService.addRecommendation(resp);
            });
    };

    ctrl.createYoutubePage = function () {
        ElyModal.show('ManageYoutubePageCtrl', 'app/modules/page/modal/manageYoutubePage/template.html')
            .then(function (resp) {
                AddRemovePinwallElementService.addRecommendation(resp);
            });
    };

    ctrl.createLinkPage = function () {
        ElyModal.show('ManageLinkPageCtrl', 'app/modules/page/modal/manageLinkPage/template.html')
            .then(function (resp) {
                AddRemovePinwallElementService.addRecommendation(resp);
            });
    };
}];

