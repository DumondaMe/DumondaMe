'use strict';

module.exports = ['ElyModal', 'AddressCreateMessageService', 'PageAddress', 'errorToast',
    function (ElyModal, AddressCreateMessageService, PageAddress, errorToast) {
        var ctrl = this;

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.createAddress = function (address, description) {
            var message = AddressCreateMessageService.getCreateAddressMessage(ctrl.pageId, address, description);
            PageAddress.save(message, function (resp) {
                ElyModal.hide(resp);
            }, function () {
                errorToast.showError("Erstellen der Adresse ist fehlgeschlagen");
            });
        };
    }];

