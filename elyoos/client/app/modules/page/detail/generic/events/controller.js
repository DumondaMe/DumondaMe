'use strict';

module.exports = ['ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.createEvent = function () {
            ElyModal.show('ManageEventCtrl', 'app/modules/page/modal/manageEvent/template.html', {
                genericPageId: ctrl.pageDetail.page.pageId, addresses: ctrl.pageDetail.page.addresses
            }).then(function (resp) {
                //$state.go('page.detail', {label: 'Blog', pageId: resp.pageId});
            });
        };
    }];

