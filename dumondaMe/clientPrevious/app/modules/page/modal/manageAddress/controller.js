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
                var result = {
                    addressId: resp.addressId,
                    address: message.create.address,
                    description: message.create.description,
                    latitude: message.create.latitude,
                    longitude: message.create.longitude
                };
                ElyModal.hide(result);
            }, function () {
                errorToast.showError("Erstellen der Adresse ist fehlgeschlagen");
            });
        };

        ctrl.editAddress = function (address, description) {
            var message = AddressCreateMessageService.getEditAddressMessage(ctrl.actualAddress.addressId, address, description);
            PageAddress.save(message, function () {
                var result = {
                    addressId: message.edit.addressId,
                    address: message.edit.address,
                    description: message.edit.description,
                    latitude: message.edit.latitude,
                    longitude: message.edit.longitude
                };
                ElyModal.hide(result);
            }, function () {
                errorToast.showError("Ändern der Adresse ist fehlgeschlagen");
            });
        };
    }];

