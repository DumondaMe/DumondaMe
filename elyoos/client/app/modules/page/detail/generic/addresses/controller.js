'use strict';

module.exports = ['ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.addAddress = function () {
            ElyModal.show('ManageAddressCtrl', 'app/modules/page/modal/manageAddress/template.html', {
                pageId: ctrl.pageDetail.page.pageId
            }).then(function (address) {
                ctrl.pageDetail.page.addresses.unshift(address);
            });
        };
    }];

